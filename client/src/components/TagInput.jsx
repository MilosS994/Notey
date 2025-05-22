import { MdAdd, MdClose } from "react-icons/md";
import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  //   Function to add a new tag
  const addNewTag = (e) => {
    if (inputValue.trim() !== "") {
      setTags((prevTags) => [...prevTags, inputValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        {tags?.length > 0 &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-black text-sm md:text-base px-2 py-1 rounded-md shadow-sm"
            >
              #{tag}{" "}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                }}
              >
                <MdClose className="cursor-pointer font-bold transition-all duration-200 ease-in-out hover:text-red-500" />
              </button>
            </span>
          ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Add tags"
          className="w-full text-sm md:text-base text-black outline-none bg-blue-50 shadow-sm p-2 rounded-md"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 rounded-md border-primary border-2 active:scale-95 flex items-center justify-center hover:border-secondary"
          onClick={addNewTag}
          title="Add Tag"
        >
          <MdAdd className="text-2xl text-primary hover:text-secondary transition-all duration-200 cursor-pointer text-shadow-md md:text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
