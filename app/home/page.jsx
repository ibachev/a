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

// Mobile-friendly note-taking component for Next.js + MUI
// - Client component (uses localStorage)
// - Add / Edit / Delete notes
// - Search/filter
// - Export / Import JSON
// - Small responsive layout and FAB for mobile

const STORAGE_KEY = "pwa-notes-v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function MobileNotesComponent({ storageKey = STORAGE_KEY }) {
  const [notes, setNotes] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [query, setQuery] = useState("");

  // load notes from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNotes(parsed);
      }
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  }, [storageKey]);

  // save notes to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [notes, storageKey]);

  const filtered = useMemo(() => {
    if (!query) return notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    const q = query.toLowerCase();
    return notes
      .filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.body && n.body.toLowerCase().includes(q))
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, query]);

  function handleOpenNew() {
    setEditingNote({ id: null, title: "", body: "" });
    setOpenEditor(true);
  }

  function handleOpenEdit(note) {
    setEditingNote({ ...note });
    setOpenEditor(true);
  }

  function handleCloseEditor() {
    setOpenEditor(false);
    setEditingNote(null);
  }

  function handleSave() {
    if (!editingNote) return;
    const now = Date.now();
    if (!editingNote.id) {
      const newNote = {
        ...editingNote,
        id: uid(),
        createdAt: now,
        updatedAt: now,
      };
      setNotes((s) => [newNote, ...s]);
    } else {
      setNotes((s) =>
        s.map((n) =>
          n.id === editingNote.id ? { ...editingNote, updatedAt: now } : n
        )
      );
    }
    handleCloseEditor();
  }

  function handleDelete(id) {
    setNotes((s) => s.filter((n) => n.id !== id));
  }

  function handleExport() {
    const payload = JSON.stringify(notes, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-notes.json";
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
          // merge by id, prefer imported note updatedAt
          setNotes((existing) => {
            const map = new Map(existing.map((n) => [n.id, n]));
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
          alert("Imported file doesn't look like a notes array.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to import notes: " + err.message);
      }
    };
    reader.readAsText(file);
    // reset input so same file can be picked again later
    e.target.value = "";
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }} noWrap>
            Notes
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search notes"
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
              No notes yet. Tap + to add one.
            </Typography>
          </Paper>
        ) : (
          <List>
            {filtered.map((note) => (
              <Box key={note.id} sx={{ mb: 1 }}>
                <Paper elevation={1}>
                  <ListItem button onClick={() => handleOpenEdit(note)}>
                    <ListItemText
                      primary={note.title || "Untitled"}
                      secondary={
                        note.body
                          ? note.body.length > 100
                            ? note.body.slice(0, 100) + "…"
                            : note.body
                          : ""
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenEdit(note)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(note.id)}
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
            Export
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
              Import
            </Button>
          </label>
        </Stack>

        <Typography variant="caption">Local · {notes.length} notes</Typography>
      </Toolbar>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", right: 16, bottom: 16 }}
        onClick={handleOpenNew}
      >
        <AddIcon />
      </Fab>

      <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
        <DialogTitle>{editingNote?.id ? "Edit note" : "New note"}</DialogTitle>
        <DialogContent sx={{ height: "100%" }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editingNote?.title ?? ""}
              onChange={(e) =>
                setEditingNote((s) => ({ ...s, title: e.target.value }))
              }
              fullWidth
              inputProps={{ maxLength: 120 }}
            />
            <TextField
              label="Body"
              value={editingNote?.body ?? ""}
              onChange={(e) =>
                setEditingNote((s) => ({ ...s, body: e.target.value }))
              }
              fullWidth
              multiline
              minRows={8}
              maxRows={40}
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Tip: Notes are stored locally in your browser. Use Export to
                save a copy.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
