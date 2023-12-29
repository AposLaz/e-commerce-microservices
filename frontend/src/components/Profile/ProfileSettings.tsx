import React from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Settings from '@/pages/profile/settings/Settings';
import Credit_Cards from '@/pages/profile/credit_cards/Credit_Cards';
import Address from '@/pages/profile/address/Address';

const ProfileSettings = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  
  return (
    <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
        </TabList>
        </Box>
        <TabPanel value="1"><Settings /></TabPanel>
        <TabPanel value="2"><Credit_Cards /></TabPanel>
        <TabPanel value="3"><Address /></TabPanel>
  </TabContext>

  )
}

export default ProfileSettings