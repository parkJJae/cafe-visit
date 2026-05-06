import { useEffect, useState } from "react";
import { getAllCafes } from "../api/CafeApi";

export default function CafeList() {
    const [cafes, setCafes] = useState([]);

    useEffect(() => {
        getAllCafes()
            .then((res) => setCafes(res.data))
            .catch((err) => console.error("카페 목록 불러오기 실패:", err));
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-5">등록된 카페 리스트</h1>

            <div className="space-y-4">
                {cafes.map((cafe) => (
                    <div
                        key={cafe.id}
                        className="p-5 border rounded shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-bold">{cafe.name}</h2>
                        <p className="text-gray-700">{cafe.address}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            등록자: <strong>{cafe.registeredBy}</strong>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}