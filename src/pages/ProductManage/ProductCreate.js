import variables from "../../config/variables";

import { Link } from "react-router-dom";
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

const ProductCreate = () => {
  // --- Tinymce
  const editorRef = useRef(null);
  // --- End tinymce

  const navigate = useNavigate();
  const [categoryTree, setCategoryTree] = useState([]);

  // --- FilePond
  const [files, setFiles] = useState([]);
  // --- End FilePond

  // ----- Get Categories Tree ----- //
  useEffect(() => {
    // const fetchAPI = async () => {
    //   const dataFromBE = await getCategoriesTree();

    //   if(dataFromBE.code == 200) {
    //     setCategoryTree(dataFromBE.data);
    //   }
    // }
    const fetchAPI = async () => {
      const dataFromBE = await getAllCategories();
      if(dataFromBE.success === true) {
        setCategoryTree(dataFromBE.data.content);
      }
    }

    fetchAPI();
  }, []);
  // ----- End get Categories Tree ----- //


  // ----- Handle submit form ----- //
  const handleSubmit = async (event, currentFiles) => {
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
      isFeatured: isFeatured,
      status: status,
      description: description
    };

    Swal.fire({
      title: "Keep creating?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Create new product!",
      cancelButtonText: "Discard"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // --- Show loading spinner alert while waiting
        Swal.fire({
          title: "Creating product...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        // --- End show loading spinner alert while waiting
  

        // const dataFromBE = await createProduct(formData);
        const response = await fetch(`http://localhost:8080/api/v1/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // allow cookies to be set and sent with requests
          body: JSON.stringify(dataSubmit)
        });

        const dataFromBE = await response.json();
  
        if(dataFromBE.success == true) {
          const productId = dataFromBE.data.id;

          for(const fileItem of currentFiles) {
            const formData = new FormData();
            formData.append("file", fileItem.file);

            await fetch(`http://localhost:8080/api/v1/products/${productId}/images`, {
              method: "POST",
              body: formData,
              credentials: "include"
            });
          }

          await Swal.fire({
            title: "Create successfully!",
            text: "Your product has been saved.",
            icon: "success",
          });
  
          navigate(`/${variables.pathAdmin}/products`);
        }
      }
    });
  }
  // ----- End handle submit form ----- //

  // ----- JustValidate ----- //
  const validatorRef = useRef(null);

  useEffect(() => {
    if (validatorRef.current) {
      validatorRef.current.destroy();
    }
  
    const validation = new JustValidate("#product-create-form");
    validatorRef.current = validation;

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Please enter product name!'
        }
      ])
      .addField('#parent', [
        {
          rule: 'required',
          errorMessage: 'Please choose a category!'
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
      <h1 className="box-title">Create Product</h1>

      <div className="section-crud">
        <form 
          id="product-create-form" 
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
            />
          </div>

          <div className="inner-group">
            <label htmlFor="stock" className="inner-label">Stock</label>
            <input 
              type="number" 
              id="stock" 
              name="stock" 
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
              defaultChecked={false}
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
              init={{
                selector: '#description',
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
                
                // images_upload_url: '/admin/upload/image', // Backend API
                // automatic_uploads: true,
                // file_picker_types: 'image',
                // image_caption: true,
              }}
            />
          </div>

          <div className="inner-button inner-two-columns">
            <button type="submit">Create</button>
          </div>
        </form>

        <div className="inner-back">
          <Link to={`/${variables.pathAdmin}/products`}>
            Back to List Products
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProductCreate;