'use client';

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, CircularProgress, Snackbar, Alert, MenuItem, Select, InputLabel } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, getDoc, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
      setFilteredInventory(inventoryList)
    } catch (error) {
      console.error("Error updating inventory: ", error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (searchTerm === '' && selectedCategory === '') {
      setFilteredInventory(inventory)
    } else {
      setFilteredInventory(
        inventory.filter(({ name, category }) =>
          (name.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '') &&
          (category === selectedCategory || selectedCategory === '')
        )
      )
    }
  }, [searchTerm, selectedCategory, inventory])

  const addItem = async (item) => {
    if (!item.trim()) {
      setNotification({ open: true, message: 'Item name cannot be empty', severity: 'error' })
      return
    }

    const docRef = doc(collection(firestore, 'inventory'), item)
    try {
      const docSnap = await getDoc(docRef)
      let newInventory = [...inventory]
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1, category })
        newInventory = newInventory.map((invItem) =>
          invItem.name === item ? { ...invItem, quantity: quantity + 1 } : invItem
        )
      } else {
        await setDoc(docRef, { quantity: 1, category })
        newInventory.push({ name: item, quantity: 1, category })
      }
      setInventory(newInventory)
      setFilteredInventory(newInventory)
      setNotification({ open: true, message: 'Item added successfully', severity: 'success' })
    } catch (error) {
      setNotification({ open: true, message: 'Error adding item', severity: 'error' })
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    try {
      const docSnap = await getDoc(docRef)
      let newInventory = [...inventory]
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
          newInventory = newInventory.filter((invItem) => invItem.name !== item)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
          newInventory = newInventory.map((invItem) =>
            invItem.name === item ? { ...invItem, quantity: quantity - 1 } : invItem
          )
        }
        setInventory(newInventory)
        setFilteredInventory(newInventory)
        setNotification({ open: true, message: 'Item removed successfully', severity: 'success' })
      }
    } catch (error) {
      setNotification({ open: true, message: 'Error removing item', severity: 'error' })
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={3}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          width={400}
          bgcolor={"white"}
          border={"2px solid black"}
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#aaa',
                  },
                },
              }}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
            </Select>
            <Button
              variant="outlined" 
              onClick={() => {
                addItem(itemName)
                setItemName('')
                setCategory('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: 2,
          width: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '4px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#aaa',
            },
          },
          '& .MuiInputBase-input': {
            fontWeight: 'bold',
          },
        }}
      />

      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        displayEmpty
        sx={{
          marginBottom: 2,
          width: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '4px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc',
            },
            '&:hover fieldset': {
              borderColor: '#aaa',
            },
          },
        }}
      >
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="Hardware">Hardware</MenuItem>
        <MenuItem value="Clothing">Clothing</MenuItem>
        <MenuItem value="Food">Food</MenuItem>
      </Select>

      <Button 
        variant="contained" 
        onClick={handleOpen}
      >
        Add New Item
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box border={"1px solid #333"}>
          <Box
            width={"800px"}
            height={"100px"}
            display={"flex"}
            bgcolor={"#fff8e2"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="h2" color={"#333"}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width={"800px"} height={"300px"} spacing={2} overflow={"auto"}>
            {filteredInventory.map(({ name, quantity, category }) => (
              <Box 
                key={name} 
                width={"100%"}
                minHeight={"150px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={5}
                sx={{
                  marginBottom: 2,
                  width: '800px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#aaa',
                    },
                  },
                }}
              >
                <Typography variant="h3" color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color={"#333"} textAlign={"center"}>
                  {quantity}
                </Typography>
                <Typography variant="h5" color={"#666"} textAlign={"center"}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}