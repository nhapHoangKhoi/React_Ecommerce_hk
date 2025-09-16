import variables from "../../config/variables";

import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { displayOptionsTree } from "../../helpers/categoryHierarchy.helper";
import { editCategory, getCategoriesTree, getCategoryById } from "../../services/categoryService";

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

const CategoryEdit = () => {
  // --- Tinymce
  const editorRef = useRef(null);
  // -- End tinymce

  const params = useParams();
  const [categoryDetail, setCategoryDetail] = useState({});
  const [selectedParent, setSelectedParent] = useState("");
  const [categoryTree, setCategoryTree] = useState([]);


  // ----- Get detail category ----- //
  const fetchCategory = async () => {
    const dataFromBE = await getCategoryById(params.id);
    if (dataFromBE.success === true) {
      setCategoryDetail(dataFromBE.data);
      setSelectedParent(dataFromBE.data.parent || "");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  // ----- End get detail category ----- //


  // ----- Get Categories Tree ----- //
  // const fetchCategoryTree = async () => {
  //   const dataFromBE = await getCategoriesTree();
  //   if (dataFromBE.code === 200) {
  //     setCategoryTree(dataFromBE.data);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategoryTree();
  // }, []);
  // ----- End get Categories Tree ----- //


  // ----- Handle submit form ----- //
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    // const parent = event.target.parent.value;
    // const position = event.target.position.value;
    const description = event.target.description.value;

    // let description = "";
    // if(editorRef.current) {
    //   description = editorRef.current.getContent();
    // }

    // console.log(name);
    // console.log(parent);
    // console.log(position);
    // console.log(description);


    const dataSubmit = {
      name: name,
      // parent: parent,
      // position: position,
      description: description
    };


    Swal.fire({
      title: "Keep updating?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Kepp updating!",
      cancelButtonText: "Discard"
    }).then( async (result) => {
        if(result.isConfirmed) {
          // --- Show loading spinner alert while waiting
          Swal.fire({
            title: "Updating category...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          // --- End show loading spinner alert while waiting


          // --- Test spinner
          // const dataFromBE = await new Promise((resolve) => {
          //   setTimeout(async () => {
          //     const result = await editCategory(params.id, dataSubmit);
          //     resolve(result);
          //   }, 5000);
          // });
          // --- End test spinner


          const dataFromBE = await editCategory(params.id, dataSubmit);

          if(dataFromBE.success == true) {
            await Swal.fire({
              title: "Update successfully!",
              text: "Your file has been saved.",
              icon: "success",
            })

            fetchCategory(); // refresh updated data
            // fetchCategoryTree(); // refresh tree
          }
        }
      });
  }
  // ----- End handle submit form ----- //

  // ----- JustValidate ----- //
  useEffect(() => {
    const validation = new JustValidate("#category-edit-form");

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Please enter category name!'
        }
      ])
      .onSuccess(async (event) => {
        await handleSubmit(event);
      })
  }, []);
  // ----- End JustValidate ----- //
  
  // console.log(categoryDetail);
  // console.log(categoryTree);

  return (
    <>
      <h1 className="box-title">Edit Category</h1>

      {categoryDetail && (
        <div className="section-crud">
          <form 
            id="category-edit-form" 
            encType="multipart/form-data"
            // onSubmit={handleSubmit}
          >
            <div className="inner-group">
              <label htmlFor="name" className="inner-label">
                Category Name <span className="field-required">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={categoryDetail.name}
              />
            </div>

            {/* {categoryTree && (
              <div className="inner-group">
                <label htmlFor="parent" className="inner-label">Parent Category</label>
                <select 
                  id="parent" 
                  name="parent" 
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {displayOptionsTree(categoryTree)}
                </select>
              </div>
            )} */}

            {/* <div className="inner-group">
              <label htmlFor="position" className="inner-label">Position</label>
              <input 
                type="number" 
                id="position" 
                name="position" 
                defaultValue={categoryDetail.position}
              />
            </div> */}

            <div className="inner-group">
              <label htmlFor="name" className="inner-label">
                Short description
              </label>
              <input 
                type="text" 
                id="description" 
                name="description" 
                defaultValue={categoryDetail.description}
              />
            </div>

            <div className="inner-button inner-two-columns">
              <button type="submit">Update</button>
            </div>
          </form>

          <div className="inner-back">
            <Link to={`/${variables.pathAdmin}/categories`}>
              Back to List Categories
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryEdit;