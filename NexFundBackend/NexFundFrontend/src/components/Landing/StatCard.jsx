import { motion } from "framer-motion";
import "./stat-card.css";

const StatCard = ({ icon, count, label, suffix }) => {
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
        ease: "easeOut",
      },
    },
  };

  const counterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="stat-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
    >
      <div className="stat-icon">{icon}</div>
      <motion.h3 variants={counterVariants} className="stat-count">
        {count}
        {suffix}
      </motion.h3>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
};

export default StatCard;
