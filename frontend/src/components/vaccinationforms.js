import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Divider,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

const API_BASE_URL = "http://localhost:3001/api/vaccine";

// NHS Colors
const nhsColors = {
  blue: "#005EB8",
  white: "#FFFFFF",
  darkGrey: "#425563",
  lightGrey: "#E8EDEE",
  green: "#007F3B",
  red: "#DA291C"
};

function VaccinationForm() {
  const [email, setEmail] = useState("");
  const [staffDetails, setStaffDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [directorates, setDirectorates] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [formData, setFormData] = useState({
    employee_number: "",
    directorate: "",
    organisation: "",
    employee_first_name: "",
    employee_last_name: "",
    email: ""
  });

  useEffect(() => {
    if (window.Office) {
      Office.onReady(() => {
        getUserEmail();
        fetchDropdownOptions();
      });
    } else {
      console.error("Office.js is not loaded");
      setLoading(false);
    }
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      console.log('Fetching dropdown options...');
      const [directoratesRes, organisationsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/directorates`),
        axios.get(`${API_BASE_URL}/organisations`)
      ]);
      console.log('Directorates:', directoratesRes.data);
      console.log('Organisations:', organisationsRes.data);
      setDirectorates(directoratesRes.data || []);
      setOrganisations(organisationsRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      // Set default options if fetch fails
      setDirectorates(["Clinical", "Administrative", "Support Services"]);
      setOrganisations(["NHS Trust", "Primary Care", "Community Services"]);
    }
  };

  const getUserEmail = async () => {
    try {
      const userEmail = Office.context.mailbox.userProfile.emailAddress;
      setEmail(userEmail);
      setFormData(prev => ({ ...prev, email: userEmail }));
      lookupStaffDetails(userEmail);
    } catch (error) {
      setError("Could not retrieve email address. Please ensure you're logged into Outlook.");
      setLoading(false);
    }
  };

  const lookupStaffDetails = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lookup/${email}`);
      if (response.data.found) {
        setStaffDetails(response.data.staff);
        setShowForm(false);
      } else {
        setShowForm(true);
      }
      setLoading(false);
    } catch (error) {
      setError("Error looking up staff details");
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/staff`, formData);
      await lookupStaffDetails(email);
      setError(null);
    } catch (error) {
      setError("Failed to save staff details");
      setLoading(false);
    }
  };

  const updateVaccinationStatus = async (response) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/submit`, {
        employee_number: staffDetails.employee_number,
        response: response
      });
      setLastResponse(response);
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        lookupStaffDetails(email);
      }, 5000); // Hide thank you message after 5 seconds
      setError(null);
    } catch (error) {
      setError("Failed to update vaccination status");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ThankYouMessage = () => {
    if (!showThankYou) return null;

    const messageStyle = {
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "16px",
      backgroundColor: lastResponse === "yes" ? nhsColors.green : nhsColors.blue,
      color: nhsColors.white
    };

    const message = lastResponse === "yes" 
      ? "Thank you for completing the form and protecting your colleagues and family. Your contribution helps create a safer workplace for everyone."
      : "Thank you for completing the form. Did you know? The flu causes an average of 11,000 deaths annually in England. Vaccination remains one of our best defenses against severe illness.";

    return (
      <Box style={messageStyle}>
        <Typography variant="h6" style={{ marginBottom: "8px" }}>
          Thank You!
        </Typography>
        <Typography variant="body1">
          {message}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress style={{ color: nhsColors.blue }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ margin: 16 }}>
        {error}
      </Alert>
    );
  }

  if (showForm) {
    return (
      <Paper style={{ margin: 16, backgroundColor: nhsColors.white }}>
        <Box p={2}>
          <Typography variant="h6" style={{ color: nhsColors.blue, marginBottom: 16 }}>
            NHS Staff Details
          </Typography>
          <Typography variant="body2" style={{ marginBottom: 16 }}>
            Please provide your details to continue
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Employee Number"
              name="employee_number"
              value={formData.employee_number}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined" required>
              <InputLabel>Directorate</InputLabel>
              <Select
                name="directorate"
                value={formData.directorate}
                onChange={handleInputChange}
                label="Directorate"
              >
                <MenuItem value="">
                  <em>Select a directorate</em>
                </MenuItem>
                {directorates.map((dir) => (
                  <MenuItem key={dir} value={dir}>
                    {dir}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined" required>
              <InputLabel>Organisation</InputLabel>
              <Select
                name="organisation"
                value={formData.organisation}
                onChange={handleInputChange}
                label="Organisation"
              >
                <MenuItem value="">
                  <em>Select an organisation</em>
                </MenuItem>
                {organisations.map((org) => (
                  <MenuItem key={org} value={org}>
                    {org}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="employee_first_name"
              value={formData.employee_first_name}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="employee_last_name"
              value={formData.employee_last_name}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              style={{ 
                backgroundColor: nhsColors.blue,
                color: nhsColors.white,
                marginTop: 16
              }}
            >
              Submit Details
            </Button>
          </form>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper style={{ margin: 16, backgroundColor: nhsColors.white }}>
      <Box p={2}>
        <Typography variant="h6" style={{ color: nhsColors.blue, marginBottom: 16 }}>
          NHS Vaccination Status
        </Typography>
        {showThankYou && <ThankYouMessage />}
        {staffDetails && (
          <>
            <Box mb={2}>
              <Typography variant="subtitle1" style={{ color: nhsColors.darkGrey }}>
                Staff Details
              </Typography>
              <Typography variant="body1">
                {staffDetails.employee_first_name} {staffDetails.employee_last_name}
              </Typography>
              <Typography variant="body2" style={{ color: nhsColors.darkGrey }}>
                {staffDetails.directorate}
              </Typography>
              <Typography variant="body2" style={{ color: nhsColors.darkGrey }}>
                Employee #: {staffDetails.employee_number}
              </Typography>
            </Box>
            
            <Divider style={{ margin: "16px 0" }} />
            
            <Box mb={2}>
              <Typography variant="subtitle1" style={{ color: nhsColors.darkGrey }}>
                Current Status
              </Typography>
              <Typography 
                variant="body1" 
                style={{ 
                  color: staffDetails.vaccinated === 'yes' ? nhsColors.green : 
                         staffDetails.vaccinated === 'no' ? nhsColors.red : 
                         nhsColors.darkGrey,
                  fontWeight: 'bold'
                }}
              >
                {staffDetails.vaccinated === 'yes' ? 'Vaccinated' :
                 staffDetails.vaccinated === 'no' ? 'Not Vaccinated' :
                 'Not Recorded'}
              </Typography>
            </Box>
            
            <Box mt={3}>
              <Typography variant="subtitle1" style={{ color: nhsColors.darkGrey, marginBottom: 16 }}>
                Update Your Status
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                style={{ 
                  backgroundColor: nhsColors.green,
                  marginBottom: 8,
                  color: nhsColors.white
                }}
                onClick={() => updateVaccinationStatus("yes")}
              >
                Yes, I've had the vaccine
              </Button>
              <Button 
                variant="contained"
                fullWidth
                style={{ 
                  backgroundColor: nhsColors.red,
                  color: nhsColors.white
                }}
                onClick={() => updateVaccinationStatus("no")}
              >
                No, I haven't had the vaccine
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}

export default VaccinationForm; 