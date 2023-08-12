export default function PreloadImageBoard({ isBlack }) {
    const classNameBase = "square " + (isBlack ? "black" : "white");
    const suffixes = [
        "",
        "-left",
        "-right",
        "-top",
        "-bottom",
        "-top-left",
        "-bottom-left",
        "-top-right",
        "-bottom-right"
    ];
    return (
        <div style={{ display: "none" }}>
            {suffixes.map((s) => (
                <div className={classNameBase + s} key={s} />
            ))}
        </div>
    );
}
