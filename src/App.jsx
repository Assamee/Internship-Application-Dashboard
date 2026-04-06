import { useState, useEffect } from 'react';
import { 
  Container, Stack, Table, Button, Form, Modal, Row, Col, InputGroup
} from 'react-bootstrap';


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
          <Button variant="danger" size="sm" type="button" onClick={() => handleDelete(application.id)}>Delete</Button>
        </td>
      </tr>
  );
}

// function to get the data currently stored in Local Storage
function initialiseLocalStorage(storageKey, defaultData) {
  // Look at the browser's local storage with the given key
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch(error) {
      return defaultData;
    }
  }
  return defaultData;
}


function ApplicationTable ({ table }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState(() => {
    return initialiseLocalStorage('dashboard_applications', table);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchByCompany, setSearchByCompany] = useState(true);


  useEffect(() => {
    const stringifiedApplications = JSON.stringify(applications);
    localStorage.setItem('dashboard_applications', stringifiedApplications);
  }, [applications]);



  // runs for each 'application' (index) in the table array
  const filteredTable = applications.filter((application) => {
    // if .includes() returns true, then the application is kept in the new array
    if (searchByCompany) {
      return (application.company.toLowerCase().includes(searchQuery.toLowerCase()))
    } else {
      return application.role.toLowerCase().includes(searchQuery.toLowerCase())
    }
  });

  function handleDelete (id) {
    const newTable = applications.filter((application) => {
      return application.id !== id;
    });
    setApplications(newTable);
  }

  return (
    <>
      <div className="mb-4 shadow-sm p-3 bg-body-tertiary rounded border">
        <Row className="align-items-center gy-3">
          
          {/* Left/Centre: The Unified Search Tool */}
          <Col xs={12} md={8} lg={9}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder={`Search by ${searchByCompany ? 'Company' : 'Role'}`}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchByCompany(!searchByCompany)}
              >
                Switch to {searchByCompany ? 'Role' : 'Company'}
              </Button>
            </InputGroup>
          </Col>
          
          {/* Right: The Add Button */}
          <Col xs={12} md={4} lg={3} className="d-grid">
            <Button variant="success" onClick={() => setIsModalOpen(true)}>
              + Add Application
            </Button>
          </Col>

        </Row>
      </div>


        <div id="ApplicationTable">
          <Table striped bordered hover responsive>
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
          </Table>
        </div>



        <Modal 
          show={isModalOpen} 
          onHide={() => setIsModalOpen(false)}
          centered // This makes the window float in the middle of the screen
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Application</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <ApplicationForm 
              applications={applications} 
              setApplications={setApplications} 
              setIsModalOpen={setIsModalOpen}
            />
          </Modal.Body>
        </Modal>
    </>
  );
}

function ApplicationForm({ applications, setApplications, setIsModalOpen }) {
  function handleSubmit(event) {
    event.preventDefault();
    const nextID = Date.now();
    const form = new FormData(event.target);

    const new_application = {
      id: nextID, 
      role: form.get("role") ? form.get("role"):'',
      company: form.get("company") ? form.get("company"):'',
      priority: "Medium",
      type: "Unknown",
      applied: false,
      status: "",
      notes: ""
    }
    setApplications([ ...applications, new_application ]);
    setIsModalOpen(false);
  }

  return (
    <>
      <Form name="applicationform" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>
            Role: 
            <Form.Control type="text" name="role" placeholder="e.g. Software Engineer" required />
          </Form.Label>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formCompany">
          <Form.Label>Company:</Form.Label>
            <Form.Control type="text" name="company" placeholder="e.g. Google" required />
        </Form.Group>
        
        <div className="d-grid mt-4">
          <Button variant="primary" type="submit">
            Add New Application
          </Button>
        </div>
      </Form>
    </>
  )
}

// Function to get the saved theme from Local Storage
function initialiseTheme() {
  const savedTheme = localStorage.getItem('dashboard_theme');
  if (savedTheme) {
    return savedTheme; // It is already a string, so no JSON.parse needed!
  }
  return 'dark'; // The default fallback if nothing is saved
}

export default function App() {
  const [theme, setTheme] = useState(initialiseTheme);

  // document.documentElement is the root element of the document (the <html> element)
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('dashboard_theme', theme);

    document.body.style.overflowX = 'hidden';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Container fluid className="py-5 px-md-5">

      <Row className="align-items-center mb-4 pb-2 border-bottom">
        <Col xs={8} md={8} className="text-center text-md-start mb-3 mb-md-0">
          <h2 className="fw-bold text-primary mb-0">Internship Dashboard</h2>
        </Col>
        <Col xs={4} md={4} className="d-flex justify-content-center justify-content-md-end">
          <Button 
            className="d-flex align-items-center gap-2 shadow-sm"
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'} 
            onClick={toggleTheme}
          >
            {/* Conditional rendering for the icons */}
            {theme === 'light' ? (
              <>
                <i className="bi bi-moon-stars-fill"></i>
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <i className="bi bi-sun-fill"></i>
                <span>Light Mode</span>
              </>
            )}
          </Button>
        </Col>
      </Row>

      <ApplicationTable table={DummyData}/>
    </Container>
  );
}


function SearchBar ({ searchQuery, setSearchQuery, searchByCompany, setSearchByCompany }) {
  const placeholder = "Search by " + (searchByCompany ? 'Company' : 'Role')

  return (
    <Form.Group controlId="searchBar">
      <Form.Control className="rounded-pill px-3"
        type="Search" 
        placeholder= {placeholder} 
        value={searchQuery} 
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </Form.Group>
  );
}

function FilterButton({ searchByCompany, setSearchByCompany }) {
  function handleFilterButton(){
    setSearchByCompany(!searchByCompany);
  }

  return (
    <>
      <Button type="button" onClick={handleFilterButton}>
            Search by {!searchByCompany ? 'Company' : 'Role'}
      </Button>
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

