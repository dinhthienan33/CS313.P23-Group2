isLoading
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  
  // City data extracted from CSV
  const cities = [
    "Bien Hoa (Southern)",
    "Cao Bang (Northern)",
    "Da Nang (Central)",
    "Haiphong (Northern)",
    "Hanoi (Northern)",
    "Ho Chi Minh City (Southern)",
    "Hue (Central)",
    "Qui Nhon (Central)"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert string values to numbers where appropriate
    const parsedValue = name !== 'glazingAreaDistribution' && name !== 'city'? 
      parseFloat(value) : name === 'glazingAreaDistribution' ? parseInt(value, 10) : value;
    
    setFormValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* City Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" disabled={isLoading}>
            <InputLabel id="city-selection-label">
              City
            </InputLabel>
            <Select
              labelId="city-selection-label"
              label="City"
              name="city"
              value={formValues.city || ''}
              onChange={handleChange}
              required
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Relative Compactness */}
        // ... existing code ...