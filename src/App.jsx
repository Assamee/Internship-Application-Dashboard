import { useState } from 'react';

// Dummy Data
const DummyData = [
  {id : 1, role : "React Developer",   company : "Meta",   priority : "High", type : "Spring Week", applied : true,  status : "Online Assessment", notes : ""},
  {id : 2, role : "Software Engineer", company : "Google", priority : "High", type : "Internship",  applied : false, status : "", notes : ""},
];


function ApplicationRow ({ application, handleDelete }) {
  return (
      <tr>
        <td scope="col">{application.role}</td>
        <td scope="col">{application.company}</td>
        <td scope="col">{application.priority}</td>
        <td scope="col">{application.type}</td>
        <td scope="col">{application.applied ? "Yes" : "No"}</td>
        <td scope="col">{application.applied ? application.status : "N/A"}</td>
        <td scope="col">{application.notes}</td>
        <td scope="col">
          <button type="button" onClick={() => handleDelete(application.id)}>Delete</button>
        </td>
      </tr>
  );
}


function ApplicationTable ({ table }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState(table);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // runs for each 'application' (index) in the table array
  const filteredTable = applications.filter((application) => {
    // if .includes() returns true, then the application is kept in the new array
    return application.company.toLowerCase().includes(searchQuery.toLowerCase());
  });

  function handleDelete (id) {
    const newTable = applications.filter((application) => {
      return application.id !== id;
    });
    setApplications(newTable);
  }


  return (
    <>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <br /> <br />

      <button type="button" onClick={() => setIsModalOpen(true)}>
        Add Application
      </button>

      <div id="ApplicationTable">
        <table>
          <thead>
            <ApplicationCategoryRow />
          </thead>
          <tbody>
          {/* Creates a copy of 'table' and temporarily calls each index (each application object) 'application'
            - Repeats the function to dynamically render a row for each index (each application object in the array)
            - Then the .map function returns the result (the list of rendered rows) 
          */}
            {filteredTable.map((application) => (
              <ApplicationRow key={application.id} application={application} handleDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div style={{ border: "2px solid black", padding: "20px", marginTop: "20px" }}>
          <ApplicationForm />
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </div>
      ) : null}
    </>
  );
}

function ApplicationForm () {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Role: 
          <input type="text" name="role" />
        </label>
        <br />
        <label>
          Company:
          <input type="text" name="company" />
        </label>
        <br />
        <button type="submit">
          Add New Application
        </button>
      </form>
    </>
  )
}


export default function App() {
  return (
    <>
      <div id="Title">
        <h2>Internship Application Dashboard</h2>
      </div>
      <ApplicationTable table={DummyData}/>
    </>
  );
}


function SearchBar ({ searchQuery, setSearchQuery }) {

  return (
    <> {/* The 'input' tag creates an event object to store the typed input (stored as 'event') */}
      <input type="Search" placeholder="Search by Company" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}/>
    </>
  );
}



function ApplicationCategoryRow () {
  return (
      <tr>
        <th scope="col">Role</th>
        <th scope="col">Company</th>
        <th scope="col">Priority</th>
        <th scope="col">Type</th>
        <th scope="col">Applied</th>
        <th scope="col">Status</th>
        <th scope="col">Notes</th>
        <th scope="col">Actions</th>
      </tr>
  );
}

