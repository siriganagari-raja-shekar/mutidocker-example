import axios from "axios";
import React, { useEffect, useState } from "react";


const Fib = () => {

    const [seenIndices, setSeenIndices] = useState([]);
    const [values, setValues]  = useState({});
    const [index, setIndex] = useState(''); 

    useEffect(()=>{
        fetchValues();
        fetchIndices();
    }, []);

    const fetchValues = async ()=>{
        const valuesFromRedis = await axios.get("/api/values/current"); 
        console.log(valuesFromRedis.data);
        setValues(valuesFromRedis.data);
    };

    const fetchIndices = async ()=>{
        const valuesFromPostgres = await axios.get("/api/values/all");
        console.log(valuesFromPostgres.data);
        setSeenIndices(valuesFromPostgres.data);
    };

    const handleInputSubmit = async(event) => {
        const res = await axios.post("/api/values", {
            index: index
        });
        setIndex('');
    }
    const renderValues = () => {
        const renderedValues = [];
        for (const key in values) {
            renderedValues.push(
                <p key={key}>
                    For key {key}, I have calculated {values[key]}
                </p>
            );
        }
        return renderedValues;
    }

    return(
        <div>
            <form id="mainForm">
                <label>Enter your index: </label>
                <input type="text" name="query" id="query" onChange={(event) => setIndex(event.target.value)} value={index}/>
                <button type="button" onClick={handleInputSubmit}>Submit</button>
            </form>

            <div>
                <p><b>Indices I have seen:</b></p>
                <p>{seenIndices.map(({number})=> number).join(', ')}</p>
            </div>
            <div>
                <p><b>Calculated values:</b></p>
                {
                    renderValues()
                }
            </div>
        </div>
    );
    
}

export default Fib;