import { useState } from 'react';

// Dummy Data
const DummyData = [
  {id : 1, role : "React Developer",   company : "Meta",   priority : "High", type : "Spring Week", applied : true,  status : "Online Assessment", notes : ""},
  {id : 2, role : "Software Engineer", company : "Google", priority : "High", type : "Internship",  applied : false, status : "", notes : ""},
];


function ApplicationRow ({ application }) {
  return (
      <tr>
        <td scope="col">{application.role}</td>
        <td scope="col">{application.company}</td>
        <td scope="col">{application.priority}</td>
        <td scope="col">{application.type}</td>
        <td scope="col">{application.applied ? "Yes" : "No"}</td>
        <td scope="col">{application.applied ? application.status : "N/A"}</td>
        <td scope="col">{application.notes}</td>
      </tr>
  );
}


function ApplicationTable ({ table }) {
  const [searchQuery, setSearchQuery] = useState('');

  // runs for each 'application' (index) in the table array
  const filteredTable = table.filter((application) => {
    // if .includes() returns true, then the application is kept in the new array
    return application.company.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
              <ApplicationRow key={application.id} application={application} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
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
      <input type="Search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}/>
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
      </tr>
  );
}

