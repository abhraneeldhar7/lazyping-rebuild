import Image from "next/image"
import styles from "./root.module.css"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function LandingPage() {
    return (
        <div className="min-h-[100vh] md:gap-0 w-[100%] flex flex-col gap-[20px] justify-center items-center py-[30px]">

            <h1 className="text-[45px] md:text-[60px] font-[500] leading-[1.2em] text-[center]">NEVER LET</h1>
            <h1 className="text-[45px] md:text-[50px] font-[500] leading-[1.2em] text-[center]">YOUR SERVERS</h1>

            <div className="relative h-[fit-content] w-[100%] max-w-[500px] mx-[15px] overflow-x-[hidden] flex flex-col transition-all ease-in duraiton-300 hover:translate-y-[7px]">
                <Image src="/hero/smolpad.png" height={200} width={200} alt="" unoptimized className="h-[100%] w-[100%] object-contain" />

                <Image src="/hero/screen1.png" height={200} width={200} className={styles.heroScreen1} alt="" unoptimized />

                <Image src="/hero/screen2.png" height={200} width={200} className={styles.heroScreen2} alt="" unoptimized />

                <Image src="/hero/screen3.png" height={200} width={200} className={styles.heroScreen3} alt="" unoptimized />

                <Image src="/hero/screen4.png" height={200} width={200} className={styles.heroScreen4} alt="" unoptimized />
            </div>
            <div className="relative translate-y-[-40%] w-[100%] max-w-[500px] mx-[20px]">
                <div className="w-[100%] h-[8px] absolute top-[50%] translate-y-[-50%] z-[1] bg-[linear-gradient(90deg,transparent_0%,rgba(255,37,37,1)_10%,rgba(255,37,37,1)_90%,transparent_100%)]"></div>
                <h1 className=" text-[50px] leading-[1em] text-center font-[500]">SLEEP</h1>
            </div>

            <div className="items-center flex gap-[10px]">

                <Link href="/login">
                    <Button variant="shinny" className="text-[25px] h-[45px] rounded-[10px]">Activate</Button>
                </Link>
            </div>
        </div>)
}