import { useState } from "react";
import AdminActionCard from "./AdminActionCard/AdminActionCard";
import { AdminActionCardDataType } from "./AdminActionCardUtils";

export function AdminActionCardContainer({data}:
     {data: AdminActionCardDataType}) 
{
    const [activeActionCard, setActiveActionCard] = useState<string>('');

    return (
        <main className="max-w-screen-xl mx-auto px-4 mt-10">
            
            <div className="grid grid-cols-1 gap-x-5 gap-y-10">
            {data.map((item, index) => {
                return (
                    <AdminActionCard 
                        key={index}
                        data={item}
                        active={activeActionCard === item.title}
                        setActiveActionCard={setActiveActionCard}
                    />
                )
            })}
            </div>
        </main>
    )
}