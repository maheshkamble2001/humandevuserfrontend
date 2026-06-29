export default function CoinCard({ coins }) {

    return (

        <div className="rounded-xl border border-yellow-500 p-5">

            <h3 className="text-yellow-400">

                🪙 Coins

            </h3>

            <p className="text-3xl font-bold">

                {coins}

            </p>

        </div>

    );

}