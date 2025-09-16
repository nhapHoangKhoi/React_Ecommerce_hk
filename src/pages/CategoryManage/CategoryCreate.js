import variables from "../../config/variables";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { displayOptionsTree } from "../../helpers/categoryHierarchy.helper";
import { createCategory, getCategoriesTree } from "../../services/categoryService";

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

const CategoryCreate = () => {
  // --- Tinymce
  const editorRef = useRef(null);
  // -- End tinymce

  const navigate = useNavigate();
  const [categoryTree, setCategoryTree] = useState([]);

  // -- Loading spinner
  // const [loading, setLoading] = useState(false);
  // -- End loading spinner


  // ----- Get Categories Tree ----- //
  // useEffect(() => {
  //   const fetchAPI = async () => {
  //     const dataFromBE = await getCategoriesTree();

  //     if(dataFromBE.code == 200) {
  //       setCategoryTree(dataFromBE.data);
  //     }
  //   }

  //   fetchAPI();
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

    // -- Loading spinner
    // setLoading(true);
    // -- End loading spinner

    Swal.fire({
      title: "Keep creating?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Create new category!",
      cancelButtonText: "Discard"
    }).then( async (result) => {
        if(result.isConfirmed) {
          // --- Show loading spinner alert while waiting
          Swal.fire({
            title: "Creating category...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          // --- End show loading spinner alert while waiting


          // --- Test spinner
          // const dataFromBE = await new Promise((resolve) => {
          //   setTimeout(async () => {
          //     const result = await createCategory(dataSubmit);
          //     resolve(result);
          //   }, 5000);
          // });
          // --- End test spinner


          const dataFromBE = await createCategory(dataSubmit);

          if(dataFromBE.success == true) {
            await Swal.fire({
              title: "Create successfully!",
              text: "Your file has been saved.",
              icon: "success",
            })

            // this code only navigates
            // this code does not help to reload page or else
            // navigate(`/${variables.pathAdmin}/dashboard`);
            navigate(`/${variables.pathAdmin}/categories`);
          }
        }
      });

    // --- Old manual spinner code
    // const dataFromBE = await createCategory(dataSubmit);

    // if(dataFromBE.code == 201) {
    //   // console.log(dataFromBE);
            
    //   // --- Test spinner
    //   // setTimeout(() => {
    //   //   // this code only navigates
    //   //   // this code does not help to reload page or else
    //   //   // navigate(`/${variables.pathAdmin}/dashboard`);
    //   //   navigate(`/${variables.pathAdmin}/categories`);
    //   // }, 2000);
    //   // --- End test spinner

    //   // this code only navigates
    //   // this code does not help to reload page or else
    //   // navigate(`/${variables.pathAdmin}/dashboard`);
    //   navigate(`/${variables.pathAdmin}/categories`);
    // }
    // --- End old manual spinner code
  }
  // ----- End handle submit form ----- //

  // ----- JustValidate ----- //
  useEffect(() => {
    const validation = new JustValidate("#category-create-form");

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

  // console.log(categoryTree);

  return (
    <>
      {/* Loading spinner */}
      {/* {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-overlay"></div>
        </div>
      )} */}
      {/* End loading spinner */}

      <h1 className="box-title">Create Category</h1>

      <div className="section-crud">
        <form 
          id="category-create-form" 
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
            />
          </div>

          {/* {categoryTree && (
            <div className="inner-group">
              <label htmlFor="parent" className="inner-label">Parent Category</label>
              <select 
                id="parent" 
                name="parent" 
              >
                <option value="">-- Select Category --</option>
                {displayOptionsTree(categoryTree)}
              </select>
            </div>
          )} */}

          <div className="inner-group">
            <label htmlFor="description" className="inner-label">
              Description
            </label>
            <input 
              type="text" 
              id="description" 
              name="description" 
            />
          </div>

          <div className="inner-button inner-two-columns">
            <button type="submit">Create</button>
          </div>
        </form>

        <div className="inner-back">
          <Link to={`/${variables.pathAdmin}/categories`}>
            Back to List Categories
          </Link>
        </div>
      </div>
    </>
  );
}

export default CategoryCreate;