import React from "react";

const RANDOM_IMG = "http://i.imgflip.com/1bij.jpg";
const API_URL = "https://api.imgflip.com/get_memes";

const Meme = () => {
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    randomImage: RANDOM_IMG
  });

  const [allMemes, setAllMemes] = React.useState([]);

  const fetchImg = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setAllMemes(data.data.memes);
    console.log(data.data.memes);
  };

  React.useEffect(() => {
    fetchImg();
  }, []);

  const getMemeImage = () => {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme(meme => ({...meme,randomImage: url}));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeme(meme => ({...meme,[name]: value}));
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";

      const topText = meme.topText.toUpperCase();
      const bottomText = meme.bottomText.toUpperCase();

      const textX = canvas.width / 2;
      const textY = 50;

      ctx.fillText(topText, textX, textY);
      ctx.strokeText(topText, textX, textY);
      ctx.fillText(bottomText, textX, canvas.height - textY);
      ctx.strokeText(bottomText, textX, canvas.height - textY);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "meme.png";
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    image.src = meme.randomImage;
  };

  return (
    <main>
      <div className="form">
        <input
          type="text"
          placeholder="Top text"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" onClick={getMemeImage}>
          Get a new meme image 🖼
        </button>
        <button className="form--button" onClick={handleDownload}>
          Download Meme
        </button>
      </div>
      <div className="meme">
        <img src={meme.randomImage} className="meme--image" alt="Meme" />
        <h2 className="meme--text top">{meme.topText}</h2>
        <h2 className="meme--text bottom">{meme.bottomText}</h2>
      </div>
    </main>
  );
};

export default Meme;
