import variables from "../../config/variables";

// --- Library to format date
import moment from "moment";
// --- End library to format date

import { FaMagnifyingGlass, FaPlus, FaRegPenToSquare, FaRegTrashCan, FaTrashCan } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";

const ProductManage = () => {
  const [listProducts, setlistProducts] = useState([]);

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


  // ----- Get list products ----- //
  // separate this block of code
  // used for: reload page
  const fetchAPI = async () => {
    const dataFromBE = await getAllProducts(keywordFromURL, pageFromURL);
    if(dataFromBE.success = true) {
      setlistProducts(dataFromBE.data.content); // do not sort here, sort in BE
      setTotalPages(dataFromBE.data.totalPages);
      setTotalRecords(dataFromBE.data.totalElements);
      setSkip(dataFromBE.data.pageable.offset);
    }
  }
  
  useEffect(() => {
    fetchAPI();
  }, [keywordFromURL, pageFromURL]); // refetch when URL keyword, or URL page changes
  // ----- End get list products ----- //


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
  // const handleSoftDelete = async (itemId) => {
  //   const dataFromBE = await deleteProductSoft(itemId);
    
  //   if(dataFromBE.code == 200) {
  //     fetchAPI(); // refresh updated data ("reload" page)
  //   }
  // }
  // ----- End soft delete ----- //


  // console.log(listProducts);

  return (
    <>
      <h1 className="box-title">Products management</h1>

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
            <Link to={`/${variables.pathAdmin}/products/create`}>
              <FaPlus /> Create new
            </Link>
          </div>

          {/* <div className="inner-button-trash">
            <Link to={`/${variables.pathAdmin}/products/trash`}>
              <FaTrashCan /> Recycle bin
            </Link>
          </div> */}
        </div>
      </div>
      {/* End section-action-tools */}


      {/* section-table-products-page */}
      <div className="section-table-products-page">
        <div className="table-two">
          <table>
            <thead>
              <tr>
                <th className="inner-center">
                  <input type="checkbox" className="inner-check" name="check-all" />
                </th>
                <th>Product name</th>
                <th>Thumbnail</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="inner-center">Position</th>
                <th>Created on</th>
                <th>Last updated on</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listProducts.map((item) => (
                <tr key={item.id}>
                  <td className="inner-center">
                    <input type="checkbox" className="inner-check" data-id={item.id} />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : null}
                      alt={item.name}
                      className="inner-avatar"
                    />
                  </td>
                  <td>
                    {item.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td>{item.stock}</td>
                  <td className="inner-center">{item.position}</td>
                  <td>
                    {/* <div>Le Van A</div> */}
                    <div className="inner-time">
                      {moment(item.createdOn).format("HH:mm:ss - DD/MM/YYYY")}
                    </div>
                  </td>
                  <td>
                    {/* <div>Le Van A</div> */}
                    <div className="inner-time">
                      {moment(item.updatedOn).format("HH:mm:ss - DD/MM/YYYY")}
                    </div>
                  </td>
                  <td>
                    <div className="inner-buttons">
                      <Link
                        to={`/${variables.pathAdmin}/products/${item.id}/edit`}
                        className="inner-edit"
                      >
                        <FaRegPenToSquare />
                      </Link>

                      <button
                        className="inner-delete"
                        // onClick={() => handleSoftDelete(`${item.id}`)}
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
      {/* End section-table-products-page */}


      {/* section-page-control */}
      <div className="section-page-control">
        <span className="inner-label">
          Display {skip + 1} - {skip + listProducts.length} of {totalRecords}
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

export default ProductManage;