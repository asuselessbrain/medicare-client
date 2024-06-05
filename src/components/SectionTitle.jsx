const SectionTitle = ({ heading, subHeading }) => {
    return (
        <div className="text-center space-y-3">
            <h3 className="text-4xl md:text-[42px] text-[#27477d] font-bold font-Quicksand">{heading}</h3>
            <h1 className="italic font-DancingScript text-xl md:text-2xl">{subHeading}</h1>
        </div>
    );
};

export default SectionTitle;
