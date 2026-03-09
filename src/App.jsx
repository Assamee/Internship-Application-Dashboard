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

  return (
    <>
      <SearchBar query={"Data"}/>

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
            {table.map((application) => (
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


function SearchBar ({ query }) {
  return (
    <>
      <form>
          <input type="Search" />
          <button type="Submit">Search</button>
        </form>
    </>
  );
}

function ApplicationCategoryRow  () {
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

