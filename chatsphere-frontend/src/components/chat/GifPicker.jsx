import { useState } from "react";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch("YOUR_GIPHY_API_KEY"); // Users can get free key from developers.giphy.com

export default function GifPicker({ onGifSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGifs = (offset) => {
    if (searchTerm) {
      return gf.search(searchTerm, { offset, limit: 10 });
    }
    return gf.trending({ offset, limit: 10 });
  };

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    onGifSelect(gif.images.original.url);
    onClose();
  };

  return (
    <div className="gif-picker-modal">
      <div className="gif-overlay" onClick={onClose} />
      <div className="gif-picker-content">
        <div className="gif-header">
          <h3>Search GIFs</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="gif-search">
          <input
            type="text"
            placeholder="Search GIPHY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="gif-grid-container">
          <Grid
            width={400}
            columns={2}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
            key={searchTerm}
          />
        </div>

        <div className="gif-footer">
          <span>Powered by GIPHY</span>
        </div>
      </div>
    </div>
  );
}
