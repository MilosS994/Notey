import { useState, useEffect } from "react";
import NoteGrid from "../components/notes/NoteGrid";
import Navbar from "../components/notes/Navbar";

const Notes = () => {
  const [sortValue, setSortValue] = useState("multi");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className="relative">
      <Navbar
        value={sortValue}
        onChange={(e) => setSortValue(e.target.value)}
        search={search}
        onSearch={(e) => setSearch(e.target.value)}
        onAddNote={() => setShowCreateNoteModal(true)}
      />
      <NoteGrid
        sortValue={sortValue}
        search={debouncedSearch}
        showCreateNoteModal={showCreateNoteModal}
        setShowCreateNoteModal={setShowCreateNoteModal}
      />
    </div>
  );
};

export default Notes;
