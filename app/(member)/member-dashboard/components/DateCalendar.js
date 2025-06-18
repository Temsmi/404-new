'use client';

import React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box } from '@mui/material';

const DateCalendarViews = ({ defaultDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ width: '100%', maxWidth: 280 }}> 
            <DateCalendar
                views={['day']}
                defaultValue={defaultDate || dayjs()}
                sx={{
                width: '100%',
                '& .MuiPickersDay-root': {
                    fontSize: '0.8rem',
                },
                }}
            />
            </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateCalendarViews;
