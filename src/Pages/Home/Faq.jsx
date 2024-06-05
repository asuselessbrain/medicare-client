import { Accordion } from "flowbite-react";
import faqImage from "../../assets/faq.png";
import SectionTitle from "../../components/SectionTitle";
const Faq = () => {
    return (
        <div className="py-5">
            <SectionTitle
                heading={"Frequently asked questions"}
                subHeading={"Your Queries Answered"}
            />
            <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/2">
                    <div className="flex flex-col py-5">
                        <Accordion>
                            <Accordion.Panel>
                                <Accordion.Title>
                                    How do I register for a medical camp?
                                </Accordion.Title>
                                <Accordion.Content>
                                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                                        Registration for our medical camps can be done through our
                                        website. Simply visit the event page of the camp you&apos;re
                                        interested in and follow the registration instructions
                                        provided there.
                                    </p>
                                </Accordion.Content>
                            </Accordion.Panel>
                            <Accordion.Panel>
                                <Accordion.Title>
                                    Are these medical camps free of charge?
                                </Accordion.Title>
                                <Accordion.Content>
                                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                                        Yes, all our medical camps are free for participants. We
                                        believe in providing accessible healthcare services to all
                                        members of the community without any financial barriers.
                                    </p>
                                </Accordion.Content>
                            </Accordion.Panel>
                            <Accordion.Panel>
                                <Accordion.Title>
                                    Can I volunteer at the medical camps?
                                </Accordion.Title>
                                <Accordion.Content>
                                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                                        Absolutely! We welcome volunteers who are passionate about
                                        contributing to community health. You can find volunteer
                                        opportunities listed on the respective event pages or reach
                                        out to us directly for more information on how to get
                                        involved.
                                    </p>
                                </Accordion.Content>
                            </Accordion.Panel>
                        </Accordion>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-end">
                    <img className="w-[400px] hidden md:block" src={faqImage} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default Faq;
