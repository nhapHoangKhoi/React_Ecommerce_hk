import variables from "../../config/variables";

// --- Library to format date
import moment from "moment";
// --- End library to format date

import { FaMagnifyingGlass, FaPlus, FaRegPenToSquare, FaRegTrashCan, FaTrashCan } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { deleteCategorySoft, getAllCategories } from "../../services/categoryService";

const CategoryManage = () => {
  const [listCategories, setListCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // ----- Search ----- //
  const params = new URLSearchParams(location.search);
  const keywordFromURL = params.get("keyword") || "";
  // ----- End search ----- //

  // ----- Pagination ----- //
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [skip, setSkip] = useState(0);
  const pageFromURL = parseInt(params.get("page") || "1");
  // ----- End pagination ----- //


  // ----- Get list categories ----- //
  // separate this block of code
  // used for: reload page
  const fetchAPI = async () => {
    const dataFromBE = await getAllCategories(keywordFromURL, pageFromURL);
    
    if(dataFromBE.success = true) {
      setListCategories(dataFromBE.data.content); // do not sort here, sort in BE
      setTotalPages(dataFromBE.data.totalPages);
      setTotalRecords(dataFromBE.data.totalElements);
      setSkip(dataFromBE.data.pageable.offset);
    }
  }
  
  useEffect(() => {
    fetchAPI();
  }, [keywordFromURL, pageFromURL]); // refetch when URL keyword, or URL page changes
  // ----- End get list categories ----- //


  // ----- Search ----- //
  const handleSearch = (event) => {
    if (event.code === "Enter") {
      const value = event.target.value.trim();
      const newParams = new URLSearchParams(location.search);
  
      if (value) {
        newParams.set("keyword", value);
      } 
      else {
        newParams.delete("keyword");
      }
  
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
      // navigation updates URL and triggers component re-render due to changed keyword
    }
  };
  // ----- End search ----- //


  // ----- Pagination ----- //
  const handleChangePage = (event) => {
    const value = event.target.value;
    const newParams = new URLSearchParams(location.search);
  
    if(value) {
      newParams.set("page", value);
    } 
    else {
      newParams.delete("page");
    }
  
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };
  // ----- End pagination ----- //


  // ----- Soft delete ----- //
  const handleSoftDelete = async (itemId) => {
    const dataFromBE = await deleteCategorySoft(itemId);
    
    if(dataFromBE.code == 200) {
      fetchAPI(); // refresh updated data ("reload" page)
    }
  }
  // ----- End soft delete ----- //


  // console.log(listCategories);

  return (
    <>
      <h1 className="box-title">Categories management</h1>

      {/* section-action-tools */}
      <div className="section-action-tools">
        <div className="inner-wrap">
          <div className="box-search">
            <div className="inner-search">
              <FaMagnifyingGlass />
              <input
                type="text"
                placeholder="Search for..."
                onKeyUp={handleSearch}
                defaultValue={keywordFromURL}
              />
            </div>
          </div>

          <div className="inner-button-create">
            <Link to={`/${variables.pathAdmin}/categories/create`}>
              <FaPlus /> Create new
            </Link>
          </div>

          {/* <div className="inner-button-trash">
            <Link to={`/${variables.pathAdmin}/categories/trash`}>
              <FaTrashCan /> Recycle bin
            </Link>
          </div> */}
        </div>
      </div>
      {/* End section-action-tools */}

      {/* section-table-categories-page */}
      <div className="section-table-categories-page">
        <div className="table-two">
          <table>
            <thead>
              <tr>
                <th className="inner-center">
                  <input type="checkbox" className="inner-check" name="check-all" />
                </th>
                <th>Category name</th>
                <th>Description</th>
                <th>Created on</th>
                <th>Last updated on</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listCategories.map((item) => (
                <tr key={item.id}>
                  <td className="inner-center">
                    <input type="checkbox" className="inner-check" data-id={item.id} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    {/* <div>Le Van A</div> */}
                    <div className="inner-time">
                      {moment(item.createdAt).format("HH:mm:ss - DD/MM/YYYY")}
                    </div>
                  </td>
                  <td>
                    {/* <div>Le Van A</div> */}
                    <div className="inner-time">
                      {moment(item.updatedAt).format("HH:mm:ss - DD/MM/YYYY")}
                    </div>
                  </td>
                  <td>
                    <div className="inner-buttons">
                      <Link
                        to={`/${variables.pathAdmin}/categories/${item.id}/edit`}
                        className="inner-edit"
                      >
                        <FaRegPenToSquare />
                      </Link>

                      <button
                        className="inner-delete"
                        onClick={() => handleSoftDelete(`${item.id}`)}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* End section-table-categories-page */}

      {/* section-page-control */}
      <div className="section-page-control">
        <span className="inner-label">
          Display {skip + 1} - {skip + listCategories.length} of {totalRecords}
        </span>

        <select
          className="inner-pagination"
          value={pageFromURL}
          onChange={handleChangePage}
        >
          {[...Array(totalPages)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </div>
      {/* End section-page-control */}
    </>
  );
}

export default CategoryManage;