import { motion } from "framer-motion";
import "./review-card.css";

const ReviewCard = ({ review, index }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="review-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)" }}
    >
      <div className="review-stars">⭐⭐⭐⭐⭐</div>
      <p className="review-text">"{review.text}"</p>
      <div className="review-author">
        <div className="review-avatar">{review.avatar}</div>
        <div className="review-info">
          <h4 className="review-name">{review.name}</h4>
          <p className="review-role">{review.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
