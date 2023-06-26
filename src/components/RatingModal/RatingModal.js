import React from "react";
import "./RatingModal.css";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { IconContext } from "react-icons";
import { IconCross } from "../../pages/Shop/utils/Icons";
import { useEffect } from "react";

const Modal = ({ open, onClose, productRating, setStars }) => {
  const handleRating = (rating) => {
    let inputData = productRating;
    for (let i = 0; i < productRating.length; i++) {
      if (i <= rating) {
        inputData[i] = true;
      } else {
        inputData[i] = false;
      }
    }
    setStars(inputData);
  };

  if (!open) return null;
  return (
    <div onClick={onClose} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer p-4 flex flex-col "
      >
        <div className="w-full flex justify-end">
          <div
            onClick={onClose}
            className="w-6 h-6 hover:scale-110 transition-all duration-300"
          >
            <IconCross />
          </div>
        </div>
        <div className="w-full flex-1">
          <div className="text-center text-lg text-cldark my-4">
            Rate this product
          </div>
          <div className="w-full flex items-center justify-center gap-4">
            {}
            {productRating.map((star, idx) => (
              <div key={idx}>
                {productRating[idx] ? (
                  <IconContext.Provider
                    value={{ color: "green", size: "50px" }}
                  >
                    <BsStarFill
                      onClick={() => handleRating(idx)}
                      className="hover:scale-110 transition-all duration-300"
                    />
                  </IconContext.Provider>
                ) : (
                  <IconContext.Provider
                    value={{ color: "green", size: "50px" }}
                  >
                    <BsStar
                      onClick={() => handleRating(idx)}
                      className="hover:scale-110 transition-all duration-300"
                    />
                  </IconContext.Provider>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
