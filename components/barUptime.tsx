export default function BarUptime() {
    return (<div className="flex gap-[3px] flex-1 justify-end">
        {[...Array(24)].map((_, index) => (
            <div
                className="rounded-[1px] h-[35px] min-w-[6px] flex-1 max-w-[8px]"
                style={{
                    background: "linear-gradient(180deg, #5fffb4ff 0%, #00ff88 50%, #007a3d 100%)"
                }}
                key={index}
            />
        ))}
    </div>)
}
