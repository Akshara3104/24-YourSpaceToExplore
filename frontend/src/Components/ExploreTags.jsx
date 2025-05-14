import { useNavigate } from "react-router-dom";

const tags = [
  "Technology",
  "Art",
  "Music",
  "Business",
  "Design",
  "Law",
  "Engineering",
  "Medicine",
  "Education",
  "Finance",
  "Writing",
  "Sports",
];

export default function ExploreTags() {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/explore/${tag.toLowerCase()}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Explore by Interests</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="bg-gray-100 hover:bg-black hover:text-white transition-colors px-4 py-2 rounded-full text-sm font-medium shadow-sm"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
