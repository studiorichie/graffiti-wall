import React, { useRef, useEffect, useState } from "react";
import "./styles/App.css";

const App = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight;
        ctx.fillStyle = "#000"; // Background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const startDrawing = (e) => {
            setDrawing(true);
            draw(e);
        };

        const stopDrawing = () => {
            setDrawing(false);
            ctx.beginPath();
        };

        const draw = (e) => {
            if (!drawing) return;
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#FFF";
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        };

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mousemove", draw);

        return () => {
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mouseup", stopDrawing);
            canvas.removeEventListener("mousemove", draw);
        };
    }, [drawing]);

    return (
        <div className="container">
            <canvas ref={canvasRef} className="graffitiCanvas"></canvas>
        </div>
    );
};

export default App;
