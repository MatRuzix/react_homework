import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import { GlobalContext } from "../App";

export default function TableProperties({
  pokemons,
  itemsPerPage,
  currentPageSetter,
  itemsPerPageSetter,
  currentArraySetter,
  currentArray,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { pokemonTypes } = useContext(GlobalContext);

  const [itemsPerPageArray, setItemsPerPageArray] = useState([]);
  const [goToPage, setGoToPage] = useState();

  const handleSearchInput = (e) => {
    currentPageSetter(1);
    pokemons.data &&
      currentArraySetter(
        pokemons.data.filter((pokemon) => pokemon.name.includes(e.target.value))
      );
  };
  const handleTypeFilter = (e) => {
    currentPageSetter(1);
    pokemons.data &&
      currentArraySetter(
        pokemons.data.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name.includes(e.target.value))
        )
      );
  };
  const handleItemPerPageChange = (e) => {
    itemsPerPageSetter(e.target.value);
  };
  const handleGoToPageChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      if (value * itemsPerPage <= currentArray.length + itemsPerPage) {
        setGoToPage(value);
      } else {
        enqueueSnackbar(
          `Such page does not exist, last page is ${Math.ceil(
            currentArray.length / itemsPerPage
          )}`
        );
        setGoToPage((prev) => prev);
      }
    } else {
      setGoToPage(1);
    }
  };
  const handleGoClick = () => {
    const newPage = goToPage;
    if (newPage > 0) {
      currentPageSetter(newPage);
    }
  };

  useEffect(() => {
    for (let i = 6; i < 31; i += 3) {
      if (i === 6) {
        setItemsPerPageArray([i]);
      } else {
        setItemsPerPageArray((prev) => [...prev, i]);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "10vh",
        width: "100%",
        padding: "10px",
        border: "3px solid lightblue",
        backgroundColor: "warning.light",
      }}
    >
      <TextField
        label="Search"
        variant="filled"
        sx={{ width: "55%" }}
        onChange={handleSearchInput}
        size="small"
      />
      <Box
        id="goToPageBox"
        sx={{
          display: "flex",
          width: "25%",
          margin: "0 2% 0 2%",
          alignItems: "center",
        }}
      >
        <TextField
          label="To Page"
          variant="outlined"
          sx={{ width: "70%" }}
          size="small"
          onChange={handleGoToPageChange}
        />
        <Button
          variant="outlined"
          onClick={handleGoClick}
          sx={{ width: "30%", color: "black", height: "90%" }}
        >
          GO
        </Button>
      </Box>
      <Select
        sx={{ width: "10%" }}
        label="Pokemons Per Page"
        value={itemsPerPage}
        onChange={handleItemPerPageChange}
        size="small"
      >
        {itemsPerPageArray.map((item) => {
          return (
            <MenuItem
              key={`${item} items per page`}
              value={item}
            >{`${item}`}</MenuItem>
          );
        })}
      </Select>
      <Box
        sx={{
          display: "flex",
          width: "84%",
          marginTop: "1%",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          sx={{
            width: "20%",
            height: "80%",
            alignSelf: "center",
            textAlign: "center",
            fontSize: " 0.9rem",
          }}
        >
          Filter by Type
        </Typography>
        {pokemonTypes.length > 0 && (
          <Select
            sx={{ width: "60%", height: "60%" }}
            onChange={handleTypeFilter}
            size="small"
          >
            <MenuItem selected value={""}>
              NO FILTER
            </MenuItem>
            {pokemonTypes.map((type) => {
              return (
                <MenuItem key={`${type} type pokemons`} value={type.name}>
                  {type.name.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </Box>
    </Box>
  );
}
