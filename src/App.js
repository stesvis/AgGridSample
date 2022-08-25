import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "react-toastify/dist/ReactToastify.css";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ToastContainer, toast } from "react-toastify";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

const App = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

  const MenuCellRenderer = (params) => {
    // console.log("params", params);

    return (
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <i className="fa fa-bars"></i>
        </button>
        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="/#">
              Action
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/#">
              Another action
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/#">
              Something else here
            </a>
          </li>
        </ul>
      </div>
    );
  };

  const SubGridRenderer = (params) => {
    return (
      <table>
        <tr>
          <th>Company</th>
          <th>Contact</th>
          <th>Country</th>
        </tr>
        <tr>
          <td>Alfreds Futterkiste</td>
          <td>Maria Anders</td>
          <td>Germany</td>
        </tr>
        <tr>
          <td>Centro comercial Moctezuma</td>
          <td>Francisco Chang</td>
          <td>Mexico</td>
        </tr>
        <tr>
          <td>Ernst Handel</td>
          <td>Roland Mendel</td>
          <td>Austria</td>
        </tr>
        <tr>
          <td>Island Trading</td>
          <td>Helen Bennett</td>
          <td>UK</td>
        </tr>
        <tr>
          <td>Laughing Bacchus Winecellars</td>
          <td>Yoshi Tannamuri</td>
          <td>Canada</td>
        </tr>
        <tr>
          <td>Magazzini Alimentari Riuniti</td>
          <td>Giovanni Rovelli</td>
          <td>Italy</td>
        </tr>
      </table>
    );
  };

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { checkboxSelection: true },
    { field: "name", filter: true },
    { field: "email", filter: true },
    { field: "website" },
    { field: "menu", cellRenderer: MenuCellRenderer },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    if (event.colDef.field === "menu") return event.event.preventDefault();

    console.log("cellClicked", event);
    toast.info(`Cell clicked: ${event.data.name}`);
  }, []);

  // Example load data from sever
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await response.json();
    response = await fetch("https://jsonplaceholder.typicode.com/users");
    data = [...data, ...(await response.json())];
    setRowData(data);
  };

  // Example using Grid's API
  const handleDeselectAll = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  const handleAddOne = (e) => {
    setRowData([{ name: "John Doe", email: "john.doe@email.com" }, ...rowData]);
  };

  const onGridReady = (params) => {
    console.log(params.api);
    params.api.forEachNode((node) =>
      node.rowIndex === 1 ? node.setSelected(true) : node.setSelected(false)
    );
  };

  return (
    <div className="p-1">
      <div className="mb-3">
        {/* Example using Grid's API */}
        <button className="btn btn-primary me-1" onClick={handleAddOne}>
          Add One
        </button>
        <button className="btn btn-primary me-1" onClick={handleDeselectAll}>
          Deselect All
        </button>
      </div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className="ag-theme-alpine"
        style={{ width: "100%", height: "calc(100vh - 100px)" }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          rowHeight={50}
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          suppressRowDeselection={true}
          onGridReady={onGridReady}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
