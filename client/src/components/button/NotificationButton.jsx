import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import useGetConnectedUser from '../hooks/useGetConnectedUser';
import { Box, Divider, Typography } from '@mui/material';

export default function NotificationButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  const user = useGetConnectedUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://195.35.29.110:8000/api/users/${user.connectedUser.id}/notifications`, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
        const data = await response.json()
        const filteredData = data.filter(notification => !notification.isRead)
        setNotifications(filteredData)
      }
      catch (error) {
        console.log(error)
      }
    }

    fetchNotifications();
  }, [user.connectedUser])



  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRead = async (id) => {
    try {
      await fetch(`http://195.35.29.110:8000/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isRead: true })
      })
    }

    catch (error) {
      console.log(error)
    }

    const newNotifications = notifications.filter(notification => notification.id !== id)
    setNotifications(newNotifications)

  }

  return (
    <Box>
      <Button
        color='inherit'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <CircleNotificationsOutlinedIcon />
        </Badge>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {notifications.length === 0 ? <MenuItem>Aucune notification</MenuItem> : notifications.map(notification => (
          <MenuItem key={notification.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {notification.message ? <Typography variant="caption">{notification.message.length > 20 ? notification.message.slice(0, 30) + '...' : notification.message}</Typography> : <Typography variant="caption">Aucun message</Typography>}
            <Button onClick={() => handleRead(notification.id)}>
              <Typography variant="caption">Marquer comme lue</Typography>
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}