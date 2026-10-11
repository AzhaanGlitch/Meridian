import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlipCard from './FlipCard';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  const pointerStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e) => {
    // Distinguish between a drag/spin gesture and a click
    const dx = Math.abs(e.clientX - pointerStartPos.current.x);
    const dy = Math.abs(e.clientY - pointerStartPos.current.y);
    if (dx < 8 && dy < 8) {
      navigate(`/goals/${goal._id}`);
    }
  };

  // Clean Card face content with only Title and Description
  const CardContent = (
    <div
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{ backgroundColor: goal.cardColor || '#FBBF24' }}
      className="w-full h-full p-8 flex flex-col justify-start text-[#0F172A] relative select-none cursor-pointer rounded-3xl"
    >
      <h3 className="font-extrabold text-2xl leading-snug mb-3 text-[#0F172A] line-clamp-2">
        {goal.title}
      </h3>
      {goal.description && (
        <p className="text-sm text-[#0F172A]/85 line-clamp-6 font-medium leading-relaxed">
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
