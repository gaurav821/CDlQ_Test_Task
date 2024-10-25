import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  IconButton,
  Card,
  CardContent,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalClose from "@mui/joy/ModalClose";
import Modal from "@mui/material/Modal";
import { Sheet } from "@mui/joy";
import cssClasses from "./Cart.module.css";
import InputField from "../SubComponent/InputField";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [pricingScheme, setPricingScheme] = useState({});
  const [total, setTotal] = useState(0);
  const [opneModal, setOpenModal] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);

  const [newItem, setNewItem] = useState({
    sku: "",
    unitPrice: "",
    specialQuantity: "",
    specialPrice: "",
  });

  useEffect(() => {
    if (cart.length > 0) {
      calculateItemTotals(cart);
    } else {
      setTotal(0);
      setItemDetails([]);
    }
    // eslint-disable-next-line
  }, [cart]);

  const addItemToCart = (sku) => {
    const updatedBasket = [...cart, sku];
    setCart(updatedBasket);
  };

  const removeItemFromCart = (sku) => {
    const updatedBasket = [...cart];
    const itemIndex = updatedBasket.indexOf(sku);
    if (itemIndex > -1) {
      updatedBasket.splice(itemIndex, 1);
      setCart(updatedBasket);
    }
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
    setItemDetails([]);
    toast.success("Cart clear successfully !", {
      position: "top-center",
    });
  };

  const handleAddPricingScheme = () => {
    const { sku, unitPrice, specialQuantity, specialPrice } = newItem;
    if (pricingScheme[sku]) {
      toast.error("Pricing for this item already exists!", {
        position: "top-center",
      });
      return;
    }

    if (sku && unitPrice) {
      setPricingScheme({
        ...pricingScheme,
        [sku]: {
          unitPrice: parseFloat(unitPrice),
          specialQuantity: specialQuantity ? parseInt(specialQuantity) : null,
          specialPrice: specialPrice ? parseFloat(specialPrice) : null,
        },
      });
      toast.success("Pricing added successfully !", {
        position: "top-center",
      });
      setNewItem({
        sku: "",
        unitPrice: "",
        specialQuantity: "",
        specialPrice: "",
      });
    }
  };

  const calculateItemTotals = (cart) => {
    const itemCount = {};
    const itemDetails = [];

    cart.forEach((item) => {
      if (itemCount[item]) {
        itemCount[item] += 1;
      } else {
        itemCount[item] = 1;
      }
    });

    let newTotal = 0;

    for (const [item, count] of Object.entries(itemCount)) {
      const { unitPrice, specialQuantity, specialPrice } =
        pricingScheme[item] || {};
      let itemTotal = 0;
      if (specialQuantity && specialPrice) {
        const specialsApplied = Math.floor(count / specialQuantity);
        const regularItems = count % specialQuantity;
        itemTotal = specialsApplied * specialPrice + regularItems * unitPrice;
      } else {
        itemTotal = count * unitPrice;
      }

      newTotal += itemTotal;

      itemDetails.push({
        sku: item,
        quantity: count,
        totalPrice: itemTotal,
      });
    }

    setTotal(newTotal);
    setItemDetails(itemDetails);
  };

  return (
    <Box sx={{ padding: "20px", background: "#e6ffe6" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, color: "#006600" }}
      >
        Cart System
      </Typography>

      <Card sx={{ marginBottom: "20px",background:"#b3ffb3" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Pricing
          </Typography>
          <div className={cssClasses.pricingContainer}>
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <div className={cssClasses.pricingSubContainer}>
                <Grid item xs={12} md={3}>
                  <InputField
                    label="SKU (e.g., A)"
                    value={newItem.sku}
                    onValueChange={(e) =>
                      setNewItem({ ...newItem, sku: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InputField
                    label="Unit Price (£)"
                    type="number"
                    value={newItem.unitPrice}
                    onValueChange={(e) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: Math.abs(Number(e.target.value)),
                      })
                    }
                  />
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  width: "100%",
                }}
              >
                <Grid item xs={12} md={3}>
                  <InputField
                    label="Special Quantity (optional)"
                    type="number"
                    value={newItem.specialQuantity}
                    onValueChange={(e) =>
                      setNewItem({
                        ...newItem,
                        specialQuantity: Math.abs(Number(e.target.value)),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InputField
                    label="Special Price (£) (optional)"
                    type="number"
                    value={newItem.specialPrice}
                    onValueChange={(e) =>
                      setNewItem({
                        ...newItem,
                        specialPrice: Math.abs(Number(e.target.value)),
                      })
                    }
                  />
                </Grid>
              </div>
            </div>
            <div className={cssClasses.addPricingBtn}>
              <Grid item xs={12} sx={{ width: "30%" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPricingScheme}
                  startIcon={<AddIcon />}
                  fullWidth
                  disabled={newItem.sku === "" || newItem.unitPrice === ""}
                >
                  Add Pricing
                </Button>
              </Grid>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={cssClasses.itemsContainer}>
        <Typography variant="h6" gutterBottom>
          Add Items
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {Object.keys(pricingScheme).length > 0 ? (
            Object.keys(pricingScheme).map((sku) => (
              <Button
                key={sku}
                variant="contained"
                color="secondary"
                onClick={() => addItemToCart(sku)}
              >
                Add {sku}
              </Button>
            ))
          ) : (
            <Typography>No items added.</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem" }}
          onClick={() => {
            setOpenModal(true);
          }}
        >
          View Current Pricing
        </Button>
      </Card>

      <Card sx={{ marginBottom: "20px",background:"#b3ffb3" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basket
          </Typography>
          {itemDetails.length > 0 ? (
            <List sx={{ width: "80%", margin: "0 auto" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Pricing</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemDetails.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell>£{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeItemFromCart(item.sku)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </List>
          ) : (
            <Typography>No items in the basket.</Typography>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            sx={{ marginTop: "10px", width: "150px" }}
            fullWidth
            disabled={total === 0}
          >
            Clear Basket
          </Button>
        </CardContent>
      </Card>

      <Card className={cssClasses.totalContainer}>
        <CardContent>
          <Typography style={{ fontSize: "2rem" }}>
            <span style={{ fontWeight: 700 }}>Total: </span>
            <span style={{ fontWeight: 700, color: "#00cc00" }}>
              £{total.toFixed(2)}
            </span>
          </Typography>
        </CardContent>
      </Card>
      <ToastContainer />
      <Modal
        aria-labelledby="close-modal-title"
        open={opneModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{ minWidth: 400, borderRadius: "md", p: 1,background:"#b3ffb3" }}
        >
          <ModalClose
            onClick={() => {
              setOpenModal(false);
            }}
          />
          <div sx={{ marginBottom: "20px", width: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Pricing
              </Typography>
              {Object.keys(pricingScheme).length > 0 ? (
                <List>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Special Pricing</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(pricingScheme).map(
                          ([sku, rules], index) => (
                            <TableRow key={index}>
                              <TableCell>{sku}</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>
                                £{rules.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {rules.specialQuantity && rules.specialPrice ? (
                                  <span>
                                    <span style={{ fontWeight: 700 }}>
                                      {rules.specialQuantity}
                                    </span>{" "}
                                    for{" "}
                                    <span style={{ fontWeight: 700 }}>
                                      £{rules.specialPrice.toFixed(2)}
                                    </span>
                                  </span>
                                ) : (
                                  ""
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </List>
              ) : (
                <Typography>No pricing added yet.</Typography>
              )}
            </CardContent>
          </div>
        </Sheet>
      </Modal>
    </Box>
  );
};

export default Cart;
