import { useState, useEffect } from 'react';
import { 
  Container, Table, Button, Form, Modal, Row, Col, InputGroup, Badge, FloatingLabel
} from 'react-bootstrap';

// Dummy Data
const DummyData = [
  {
    id: 1, 
    role: "Software Engineering Intern", 
    company: "Google", 
    priority: "High", 
    type: "Internship",  
    status: "Interview", 
    notes: "Technical interview next Tuesday. Focus prep on LeetCode Mediums (Dynamic Programming & Graphs). Talk about experience building RESTful APIs with Node.js and Express.",
    jobDescription: `Join Google as a Software Engineering Intern and help build products that create opportunities for everyone.

Responsibilities:
• Write specific, tested, and reliable code using modern frameworks.
• Develop solutions to complex technical problems.
• Work closely with your host and team to complete a challenging core project.
• Write robust automated testing suites to verify API endpoints and handle edge cases.

Minimum qualifications:
• Currently pursuing a degree in Computer Science or related technical field.
• Experience with general-purpose programming languages (e.g., Python, JavaScript).
• Strong foundation in Object-Oriented Programming (OOP) and software optimisation.`
  },
  {
    id: 2, 
    role: "Technology Consulting Intern", 
    company: "EY", 
    priority: "Medium", 
    type: "Internship",  
    status: "Assessment Centre", 
    notes: "Case study interview next week. Need to practice structuring my answers. Focus on how I used Python (Pandas/Seaborn) to validate strategic pivots during the data strategy virtual experience challenge.",
    jobDescription: `Join our Technology Consulting practice to help global clients solve their most complex digital challenges.

Responsibilities:
• Assess client IT infrastructure and legacy code to reduce technical debt.
• Design data-driven strategies for digital transformation and business growth.
• Present technical and statistical findings to non-technical stakeholders.

Minimum qualifications:
• Exceptional communication and leadership skills.
• Ability to bridge the gap between commercial strategy and technical execution.
• Familiarity with Agile collaboration and driving accessibility standards.`
  },
  {
    id: 3, 
    role: "Technology Spring Week",   
    company: "J.P. Morgan",   
    priority: "High", 
    type: "Spring Week", 
    status: "Online Assessment", 
    notes: "OA features a HackerRank algorithmic test. Need to review banking sector commercial awareness and computational complexity before taking it.",
    jobDescription: `Experience the intersection of finance and technology on our Spring Week programme.

What to expect:
• Participate in coding challenges focused on scalable financial platforms.
• Shadow engineers building secure, enterprise-level software.
• Fast-track opportunity for the Summer Analyst internship.

Requirements:
• Strong analytical and problem-solving skills.
• Interest in financial markets and enterprise-level software.
• Solid understanding of algorithms and data structures.`
  },
  {
    id: 4, 
    role: "Quantitative Researcher", 
    company: "Citadel", 
    priority: "High", 
    type: "Internship",  
    status: "Yet to Apply", 
    notes: "Top priority. Need to brush up on Probability and Linear Algebra for the technical assessment. Plan to highlight my UKMT awards and Further Maths background to demonstrate logical precision under timed conditions.",
    jobDescription: `Join Citadel as a Quantitative Researcher and work at the forefront of the world's capital markets.

Responsibilities:
• Develop and test automated investment strategies using advanced statistical modelling.
• Extract predictive signals from vast, unconventional datasets using Python.
• Apply rigorous mathematical techniques to solve complex market problems.
• Collaborating with engineers to translate mathematical models into production-ready code.

Minimum qualifications:
• Pursuing a degree in a highly technical field (Computer Science, Maths, Physics).
• Strong proficiency in Python and data manipulation libraries (Pandas, NumPy).
• Exceptional mathematical foundation (Probability, Statistics, Linear Algebra).
• Demonstrated record of competitive achievement in mathematics or programming.`
  }
];


function ApplicationRow ({ application, handleDelete, handleEdit, handleView }) {
  return (
      <tr className='align-Middle' onClick={() => handleView(application)} style={{ cursor: "pointer" }}>
        <td scope="col" className='fw-bold'>{application.role}</td>
        <td scope="col">{application.company}</td>
        <td scope="col">{getPriorityBadge(application.priority)}</td>
        <td scope="col">{application.type}</td>
        <td scope="col">{getStatusBadge(application.status)}</td>
        <td scope="col" className="text-truncate" style={{ maxWidth: "150px" }}>
          {application.notes}
        </td>

        {/* e.stopPropagation to stop also triggering the 'View' modal */}
        <td scope="col">
          <Button className="m-1 shadow-sm" variant="info" size="sm" type="button" 
            onClick={(e) => {
              e.stopPropagation(); 
              handleEdit(application.id);
            }}
          >
            <i className="bi bi-pencil"></i>
          </Button>
          <Button className="m-1 shadow-sm" variant="danger" size="sm" type="button" 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(application.id);
            }}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </td>
      </tr>
  );
}

// Helper Function to map priorities to the correct Bootstrap badge
function getPriorityBadge(priority) {
  switch(priority) {
    case 'High':
      return <Badge bg="danger">High</Badge>;
    case 'Medium': 
      return <Badge bg="warning" text="dark">Medium</Badge>; // Dark text for readability on yellow
    case 'Low': 
      return <Badge bg="info">Low</Badge>;
    default: 
      return <Badge bg="secondary">N/A</Badge>;
  }
}

function getStatusBadge(status) {
  switch(status) {
    case 'Offer Recieved!': 
      return <Badge pill bg="success">Offer Recieved!</Badge>;
    case 'Interview':
    case 'Assessment Centre': 
      return <Badge pill bg="primary">{status}</Badge>;
    case 'Online Assessment': 
      return <Badge pill bg="info">{status}</Badge>;
    default: 
      return <Badge pill bg="secondary" className="text-wrap">{status || 'Yet to Apply'}</Badge>;
  }
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
  const [showFormModal, setshowFormModal] = useState(false);
  const [searchByCompany, setSearchByCompany] = useState(true);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);


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

  function handleEdit (id) {
    // Find the application to edit
    const appToEdit = applications.find(app => app.id === id);
    setEditingApp(appToEdit);
    setshowFormModal(true);
  }

  function handleOpenAddModal() {
    setEditingApp(null); // Clear any old data
    setshowFormModal(true);
  }

  function handleView(application) {
    setViewingApp(application);
    setShowViewModal(true);
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
            <Button variant="success" onClick={handleOpenAddModal}>
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
              <ApplicationRow key={application.id} application={application} handleDelete={handleDelete} handleEdit={handleEdit} handleView={handleView}/>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showFormModal} 
        onHide={() => setshowFormModal(false)}
        centered
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingApp ? "Edit Application" : "Add New Application"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <ApplicationForm 
            applications={applications} 
            setApplications={setApplications} 
            setshowFormModal={setshowFormModal}
            editingApp={editingApp}
          />
        </Modal.Body>

        <Modal.Footer>
          <ApplicationFormSaveButton editingApp={editingApp} />
        </Modal.Footer>

      </Modal>

      <ApplicationViewModal 
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        application={viewingApp}
      />
    </>
  );
}

function ApplicationFormSaveButton({ editingApp }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center w-100">
        <small className='text-muted'>* Required fields</small>
        <Button variant="primary" type="submit" form="applicationform" className="px-4">
          {editingApp ? "Save Changes" : "Add Application"}
        </Button>
      </div>
    </>
  );
}

function ApplicationForm({ applications, setApplications, setshowFormModal, editingApp }) {
  
  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const new_application = { 
      id: editingApp ? editingApp.id : Date.now(), 
      role: form.get("role") || '',
      company: form.get("company") || '',
      priority: form.get("priority") || 'N/A',
      type: form.get("type") || 'Unknown',
      status: form.get("status") || '',
      notes: form.get("notes") || '',
      jobDescription: form.get("jobDescription") || ''
    }

    if (editingApp) {
      // editing an existing application
      const updatedApplications = applications.map((app) =>
        app.id === editingApp.id ? new_application : app
      );
      setApplications(updatedApplications);
    } else {
      // adding a new application
      setApplications([ ...applications, new_application ]);
    }
    setshowFormModal(false);
  }

  return (
    <>
      <Form id="applicationform" name="applicationform" onSubmit={handleSubmit}>

        <Row>
          <Col md={6}>
            <FloatingLabel label="Role*" className="mb-3" controlId="floatingRole">  
              <Form.Control type="text" name="role" 
                defaultValue={editingApp ? editingApp.role : ''} 
                placeholder="Role" required 
              />
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel label="Company*" className="mb-3" controlId="floatingCompany">
              <Form.Control type="text" name="company" 
                defaultValue={editingApp ? editingApp.company : ''} 
                placeholder="Company" required 
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
          <FloatingLabel controlId="floatingPriority" label="Priority" className="mb-3">
            <Form.Select name="priority" defaultValue={editingApp ? editingApp.priority : ''}>
              <option disabled value="">Select...</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="N/A">N/A</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col md={4}>
          <FloatingLabel controlId="floatingType" label="Application Type" className="mb-3">
            <Form.Select name="type" defaultValue={editingApp ? editingApp.type : ''}>
              <option disabled value="">Select...</option>
              <option value="Spring Week">Spring Week</option>
              <option value="Internship">Internship</option>
              <option value="Placement Year">Placement Year</option>
              <option value="Grad Role">Grad Role</option>
              <option value="Summer Job">Summer Job</option>
              <option value="Unknown">Unknown</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col md={4}>
          <FloatingLabel controlId="floatingStatus" label="Status" className="mb-3">
            <Form.Select name="status" defaultValue={editingApp ? editingApp.status : ''}>
              <option disabled value="">Select...</option>
              <option value="Yet to Apply">Yet to Apply</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Assessment Centre">Assessment Centre</option>
              <option value="Offer Recieved!">Offer Recieved!</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        </Row>

        <FloatingLabel label="Notes" className="mb-3" controlId="floatingNotes">
            <Form.Control as="textarea" name="notes" 
              defaultValue={editingApp ? editingApp.notes : ''} 
              placeholder="Notes" 
              style={{ height: '80px' }}
            />
        </FloatingLabel>

        <FloatingLabel label="Job Description (Paste full text here)" className="mb-2" controlId="floatingJobDesc">
          <Form.Control as="textarea" name="jobDescription" 
            defaultValue={editingApp ? editingApp.jobDescription : ''} 
            placeholder="Job Description" 
            style={{ height: '150px' }} 
          />
        </FloatingLabel>

      </Form>
    </>
  )
}

function ApplicationViewModal({ show, onHide, application }) {
  const [isCopied, setIsCopied] = useState(false);

  // If there is no application selected, don't crash, just render nothing
  if (!application) return null;

  function handleCopy() {
    const textToCopy = application.jobDescription || "No job description provided.";
    navigator.clipboard.writeText(textToCopy);
    
    // Temporarily show the checkmark icon
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{application.role} at {application.company}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Priority:</strong> {application.priority}</p>
            <p><strong>Type:</strong> {application.type}</p>
          </Col>
          <Col md={6}>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Notes:</strong> {application.notes || "None"}</p>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 className="mb-0 fw-bold">Job Description</h5>
          <Button variant="outline-secondary" size="sm" onClick={handleCopy}>
            {isCopied ? (
              <><i className="bi bi-check-lg text-success"></i> Copied!</>
            ) : (
              <><i className="bi bi-clipboard"></i> Copy Text</>
            )}
          </Button>
        </div>
        
        <div 
          className="bg-body-tertiary p-3 rounded" 
          style={{ whiteSpace: "pre-wrap", maxHeight: "400px", overflowY: "auto" }}
        >
          {application.jobDescription || <span className="text-muted">No description provided.</span>}
        </div>
      </Modal.Body>
    </Modal>
  );
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
    <Container fluid="xl" className="py-5 px-md-5">

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


// Static function to display the top row of the applications table
function ApplicationCategoryRow () {
  return (
      <tr>
        <th scope="col">Role</th>
        <th scope="col">Company</th>
        <th scope="col">Priority</th>
        <th scope="col">Type</th>
        <th scope="col">Status</th>
        <th scope="col">Notes</th>
        <th scope="col">Actions</th>
      </tr>
  );
}

