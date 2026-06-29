export default function Inventory({ items }) {

    return (

        <div>

            <h2 className="text-cyan-400 mb-3">

                INVENTORY

            </h2>

            <div className="grid grid-cols-3 gap-3">

                {items.map(item => (

                    <div
                        key={item.id}
                        className="border rounded-xl p-3"
                    >

                        <div className="text-xl">

                            🎁

                        </div>

                        <h4>

                            {item.name}

                        </h4>

                        <p>

                            {item.rarity}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}