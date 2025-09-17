import variables from "../../config/variables";

import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { displayOptionsTree } from "../../helpers/categoryHierarchy.helper";
import { getAllCategories, getCategoriesTree } from "../../services/categoryService";

// --- Tinymce
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// --- End tinymce

// --- SweetAlert
import Swal from "sweetalert2";
// --- End SweetAlert

// --- JustValidate
import JustValidate from "just-validate";
// --- End JustValidate

// --- FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);
// --- End FilePond


const ProductEdit = () => {
  const { id } = useParams(); // params.id
  const navigate = useNavigate();
  
  // --- Tinymce
  const editorRef = useRef(null);
  // --- End tinymce

  const [categoryTree, setCategoryTree] = useState([]);
  const [productDetail, setProductDetail] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [defaultIsFeatured, setDefaultIsFeatured] = useState(false);

  // --- FilePond
  const [files, setFiles] = useState([]);
  const [defaultImageUrls, setDefaultImageUrls] = useState([]);
  // --- End FilePond

  
  // ----- Get Categories Tree ----- //
  // const fetchCategoryTree = async () => {
  //   const dataFromBE = await getCategoriesTree();

  //   if(dataFromBE.code === 200) {
  //     setCategoryTree(dataFromBE.data);
  //   }
  // };
  const fetchCategories = async () => {
    const dataFromBE = await getAllCategories();

    if(dataFromBE.success === true) {
      setCategoryTree(dataFromBE.data.content);
    }
  };

  useEffect(() => {
    // fetchCategoryTree();
    fetchCategories();
  }, []);
  // ----- End get Categories Tree ----- //


  // ----- Fetch product detail ----- //
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
        credentials: "include"
      });
      const data = await response.json();

      if(data.success === true) 
      {
        setProductDetail(data.data);
        
        setDefaultIsFeatured(data.data.featured);

        setDefaultImageUrls(data.data.productImages || []);

        if(data.data.productImages) {
          setFiles(
            data.data.productImages.map((object) => {
              const url = object.imageUrl;
              return {
                source: url,
                options: {
                  type: 'remote', // use the image URL directly, without expecting a Blob or File object
                },
              };
            })
          );
        }

        
        setSelectedCategory(data.data.category?.id || ""); 
      }
    };
    
    fetchProduct();
  }, [id]);
  // ----- End fetch product detail ----- //


  // ----- Handle submit form ----- //
  const handleSubmit = async (event, currFiles) => {
    event.preventDefault();

    const name = event.target.name.value;
    const parent = event.target.parent.value;
    const price = event.target.price.value;
    const stock = event.target.stock.value;
    const isFeatured = event.target.isFeatured.checked;
    const status = event.target.status.value;

    let description = "";
    if (editorRef.current) {
      description = editorRef.current.getContent();
    }

    const dataSubmit = {
      name: name,
      categoryId: parent,
      price: price,
      stock: stock,
      featured: isFeatured,
      status: status,
      description: description
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryIds", parent);
    // formData.append("position", position);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("isFeatured", isFeatured);
    formData.append("description", description);


    // Process FilePond files
    const currentFiles = currFiles;
    const currentFileNames = currentFiles
      .filter(f => f.file) // only real files
      .map(f => f.file.name);

    // console.log(name);
    // console.log(parent);
    // console.log(position);
    // console.log(currentFiles);

    let shouldUpload = false;

    // Check count mismatch
    if (currentFileNames.length !== (defaultImageUrls?.length || 0)) {
      shouldUpload = true;
    } 
    else {
      // Check for any file not matching existing URLs
      for (let name of currentFileNames) {
        const matched = defaultImageUrls.some(url => url.includes(name));
        if (!matched) {
          shouldUpload = true;
          break;
        }
      }
    }

    // Append new files only if needed
    if (shouldUpload) {
      currentFiles.forEach(fileItem => {
        console.log("Chay vao day 1: ")
        formData.append("images", fileItem.file);
      });
    } 
    else {
      // No change, preserve old image URLs
      defaultImageUrls.forEach(url => {
        console.log("Chay vao day 2:")
        formData.append("existingImageUrls", url);
      });
    }

    Swal.fire({
      title: "Save changes?",
      text: "This will update the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Save changes!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Updating product...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // allow cookies to be set and sent with requests
          body: JSON.stringify(dataSubmit)
        });

        const dataFromBE = await response.json();

        if(dataFromBE.success == true) {
          await Swal.fire({
            title: "Updated successfully!",
            text: "Product has been updated.",
            icon: "success"
          });
          navigate(`/${variables.pathAdmin}/products`);
        }
      }
    });
  };
  // ----- End handle submit form ----- //

  // ----- JustValidate ----- //
  const validatorRef = useRef(null);

  useEffect(() => {
    if (validatorRef.current) {
      validatorRef.current.destroy();
    }
  
    const validation = new JustValidate("#product-edit-form");
    validatorRef.current = validation;

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Please enter product name!'
        }
      ])
      .addField('#price', [
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Price cannot be negative!'
        }
      ])
      .addField('#stock', [
        {
          rule: 'number',
          errorMessage: 'Stock must be a number!'
        },
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Stock cannot be negative!'
        }
      ])
      .onSuccess((event) => {
        event.preventDefault();
        handleSubmit(event, files);
      })

      return () => {
        if (validatorRef.current) {
          validatorRef.current.destroy();
        }
      };
  }, [files]); // important
  // ----- End JustValidate ----- //

  return (
    <>
      <h1 className="box-title">Edit Product</h1>

      {productDetail && (
        <div className="section-crud">
          <form 
            id="product-edit-form" 
            encType="multipart/form-data"
            // onSubmit={handleSubmit}
          >
            <div className="inner-group">
              <label htmlFor="name" className="inner-label">
                Product Name <span className="field-required">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={productDetail.name}
              />
            </div>

            {categoryTree && (
              <div className="inner-group">
                <label htmlFor="parent" className="inner-label">
                  Category <span className="field-required">*</span>
                </label>
                <select 
                  id="parent" 
                  name="parent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {displayOptionsTree(categoryTree)}
                </select>
              </div>
            )}

            <div className="inner-group">
              <label htmlFor="price" className="inner-label">
                Price <span className="field-required">*</span>
              </label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                defaultValue={productDetail.price}
              />
            </div>

            <div className="inner-group">
              <label htmlFor="stock" className="inner-label">Stock</label>
              <input 
                type="number" 
                id="stock" 
                name="stock" 
                defaultValue={productDetail.stock}
              />
            </div>

            <div className="inner-group inner-two-columns">
              <label className="inner-label">Images</label>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                maxFiles={10}
                acceptedFileTypes={['image/*']}
                name="images"
                labelIdle='Drag & drop or <span class="filepond--label-action">Choose image</span>'
              />
            </div>

            <div className="inner-two-columns">
              <label htmlFor="isFeatured" className="inner-label">Featured?</label>
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                name="isFeatured"
                checked={defaultIsFeatured}
                onChange={(e) => setDefaultIsFeatured(e.target.checked)}
              />
            </div>

            <div>
              <div className="inner-two-columns" style={{ marginBottom: "5px" }}>
                Status <span className="field-required">*</span>
              </div>
              <div className="inner-group">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="ACTIVE" 
                    id="option_active" 
                    defaultChecked 
                    style={{ width: "14px", height: "14px", margin: "0 6px 0 0" }}
                  />
                  <label htmlFor="option_active" className="inner-label" style={{ margin: "0" }}>Active</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: "3px" }}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="INACTIVE" 
                    id="option_inactive" 
                    style={{ width: "14px", height: "14px", margin: "0 6px 0 0" }}
                  /> 
                  <label htmlFor="option_inactive" className="inner-label" style={{ margin: "0" }}>Inactive</label>
                </div>
              </div>
            </div>

            <div className="inner-group inner-two-columns">
              <label htmlFor="description" className="inner-label">
                Description
              </label>
              <Editor
                id="description"
                name="description"
                apiKey={process.env.REACT_APP_MCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={productDetail.description}
                init={{
                  height: 300,
                  branding: false,
                  plugins: [
                    'charmap', 'codesample', 'emoticons', 'help',
                    'image', 'link', 'lists', 'advlist', 'media',
                    'preview', 'searchreplace', 'table', 'wordcount',
                  ],
                  toolbar:
                    'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
                    'outdent indent | charmap | codesample | emoticons | image | link | ' +
                    'numlist bullist | media | preview | searchreplace | help',
                }}
              />
            </div>

            <div className="inner-button inner-two-columns">
              <button type="submit">Save Changes</button>
            </div>
          </form>

          <div className="inner-back">
            <Link to={`/${variables.pathAdmin}/products`}>
              Back to List Products
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductEdit;