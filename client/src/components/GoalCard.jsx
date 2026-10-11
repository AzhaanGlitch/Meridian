import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlipCard from './FlipCard';
import { getContrastingTextColor } from '../context/AppContext';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();

  const handleOpenGoal = () => {
    navigate(`/goals/${goal._id}`);
  };

  const textColor = getContrastingTextColor(goal.cardColor);
  const isDark = textColor === '#F8FAFC';

  // Clean Card face content with dynamic contrasting text
  const CardContent = (
    <div
      style={{ backgroundColor: goal.cardColor || '#FBBF24', color: textColor }}
      className="w-full h-full p-8 flex flex-col justify-start relative select-none cursor-pointer rounded-3xl"
    >
      <h3 
        style={{ color: textColor }}
        className="font-extrabold text-2xl leading-snug mb-3 line-clamp-2"
      >
        {goal.title}
      </h3>
      {goal.description && (
        <p 
          style={{ color: textColor, opacity: isDark ? 0.9 : 0.85 }}
          className="text-sm line-clamp-6 font-medium leading-relaxed"
        >
          {goal.description}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <FlipCard
        front={CardContent}
        back={CardContent}
        axis="y"
        flipOnClick={false}
        onCardClick={handleOpenGoal}
        draggable={true}
        dragDistance={250}
        tilt={true}
        tiltMax={16}
        glare={true}
        glareOpacity={0.18}
        hoverScale={1.03}
        perspective={1100}
        stiffness={170}
        damping={20}
        width="100%"
        height={340}
        radius={24}
        background={goal.cardColor || '#FBBF24'}
        color="#0F172A"
        shadow={true}
        shadowColor="#000000"
        shadowOpacity={0.15}
      />
    </div>
  );
};

export default GoalCard;
