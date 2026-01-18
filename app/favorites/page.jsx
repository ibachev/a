"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Paper,
  Stack,
  InputAdornment,
  Divider,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";

// Mobile-friendly recipe manager for Next.js + MUI (Macedonian)
// - Client component (uses localStorage)
// - Add / Edit / Delete recipes
// - Search/filter
// - Export / Import JSON
// - Small responsive layout and FAB for mobile

const STORAGE_KEY = "recipes-mk-v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function RecipesComponent({ storageKey = STORAGE_KEY }) {
  const [recipes, setRecipes] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [query, setQuery] = useState("");

  // load recipes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecipes(parsed);
      }
    } catch (e) {
      console.error("Не успеа вчитување рецепти:", e);
    }
  }, [storageKey]);

  // save recipes to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(recipes));
    } catch (e) {
      console.error("Не успеа зачувување рецепти:", e);
    }
  }, [recipes, storageKey]);

  const filtered = useMemo(() => {
    if (!query)
      return recipes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    const q = query.toLowerCase();
    return recipes
      .filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.body && r.body.toLowerCase().includes(q))
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [recipes, query]);

  function handleOpenNew() {
    setEditingRecipe({ id: null, title: "", body: "" });
    setOpenEditor(true);
  }

  function handleOpenEdit(recipe) {
    setEditingRecipe({ ...recipe });
    setOpenEditor(true);
  }

  function handleCloseEditor() {
    setOpenEditor(false);
    setEditingRecipe(null);
  }

  function handleSave() {
    if (!editingRecipe) return;
    const now = Date.now();
    if (!editingRecipe.id) {
      const newRecipe = {
        ...editingRecipe,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      };
      setRecipes((s) => [newRecipe, ...s]);
    } else {
      setRecipes((s) =>
        s.map((r) =>
          r.id === editingRecipe.id ? { ...editingRecipe, updatedAt: now } : r
        )
      );
    }
    handleCloseEditor();
  }

  function handleDelete(id) {
    setRecipes((s) => s.filter((r) => r.id !== id));
  }

  function handleExport() {
    const payload = JSON.stringify(recipes, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moirecepti.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          // merge by id, prefer imported recipe updatedAt
          setRecipes((existing) => {
            const map = new Map(existing.map((r) => [r.id, r]));
            for (const p of parsed) {
              if (!p.id) p.id = uid();
              map.set(
                p.id,
                p.updatedAt && Number(p.updatedAt) > 0
                  ? p
                  : { ...p, updatedAt: Date.now() }
              );
            }
            return Array.from(map.values()).sort(
              (a, b) => b.updatedAt - a.updatedAt
            );
          });
        } else {
          alert("Увезениот фајл не изгледа како листа со рецепти.");
        }
      } catch (err) {
        console.error(err);
        alert("Неуспешен увоз: " + err.message);
      }
    };
    reader.readAsText(file);
    // reset input so same file can be picked again later
    e.target.value = "";
  }

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "50px",
      }}
    >
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }} noWrap>
            Рецепти
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Пребарај рецепти"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              width: { xs: 160, sm: 240 },
            }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, overflow: "auto", flex: 1 }}>
        {filtered.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={1}>
            <Typography variant="body1">
              Нема рецепти. Притиснете + за да додадете.
            </Typography>
          </Paper>
        ) : (
          <List>
            {filtered.map((recipe) => (
              <Box key={recipe.id} sx={{ mb: 1 }}>
                <Paper elevation={1}>
                  <ListItem button onClick={() => handleOpenEdit(recipe)}>
                    <ListItemText
                      primary={recipe.title || "Без наслов"}
                      secondary={
                        recipe.body
                          ? recipe.body.length > 100
                            ? recipe.body.slice(0, 100) + "…"
                            : recipe.body
                          : ""
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Уреди">
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenEdit(recipe)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Избриши">
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              </Box>
            ))}
          </List>
        )}
      </Box>

      <Divider />

      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            size="small"
            variant="outlined"
          >
            Извези
          </Button>

          <label>
            <input
              accept="application/json"
              style={{ display: "none" }}
              type="file"
              onChange={handleImport}
            />
            <Button
              startIcon={<FileUploadIcon />}
              size="small"
              variant="outlined"
              component="span"
            >
              Увези
            </Button>
          </label>
        </Stack>

        <Typography variant="caption">
          Локално · {recipes.length} рецепти
        </Typography>
      </Toolbar>

      <Fab
        color="primary"
        aria-label="додади"
        sx={{ position: "fixed", right: 16, bottom: 106 }}
        onClick={handleOpenNew}
      >
        <AddIcon />
      </Fab>

      <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
        <DialogTitle>
          {editingRecipe?.id ? "Уреди рецепт" : "Нов рецепт"}
        </DialogTitle>
        <DialogContent sx={{ height: "100%" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Име на рецепт"
              value={editingRecipe?.title ?? ""}
              onChange={(e) =>
                setEditingRecipe((s) => ({ ...s, title: e.target.value }))
              }
              fullWidth
              inputProps={{ maxLength: 120 }}
            />
            <TextField
              label="Состојки и упатства"
              value={editingRecipe?.body ?? ""}
              onChange={(e) =>
                setEditingRecipe((s) => ({ ...s, body: e.target.value }))
              }
              fullWidth
              multiline
              minRows={8}
              maxRows={40}
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Совет: Рецептите се складираат локално во вашиот прелистувач.
                Користете Извези за да зачувате копија.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor}>Откажи</Button>
          <Button onClick={handleSave} variant="contained">
            Зачувај
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
