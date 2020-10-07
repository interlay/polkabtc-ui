import { planckToDOT, satToBTC } from "@interlay/polkabtc";
import React, { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";
import { StoreType } from "../common/types/util.types";
import Big from "big.js";  

export default function LandingPage(): JSX.Element {
    const [totalPolkaBTC, setTotalPolkaBTC] = useState("...");
    const [totalLockedDOT, setTotalLockedDOT] = useState("...");
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;
            if (!storage) return;
            const totalPolkaSAT = await polkaBTC.treasury.totalPolkaBTC();
            const totalLockedPLANCK = await polkaBTC.collateral.totalLockedDOT();
            const totalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
            const totalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();
            // TODO: write parachain data to storage
            setTotalPolkaBTC(totalPolkaBTC);
            setTotalLockedDOT(totalLockedDOT);
        };
        fetchData();
    }, [polkaBTC, storage]);

    return (
        <div>
            <section className="jumbotron min-vh-100 text-center white-background mt-2">
                <div className="container mt-5">
                    <Link to="/">
                        <Image src={PolkaBTCImg} width="256"></Image>
                    </Link>
                    <h3 style={{ fontSize: "1.5em" }} className="lead text-muted mt-3">
                        PolkaBTC: Trustless and open DeFi access for your Bitcoin.
                    </h3>

                    <Row className="mt-5">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">Issued: {totalPolkaBTC} PolkaBTC</h5>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">Locked: {totalLockedDOT} DOT</h5>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col className="mt-2" xs="12" sm={{ span: 4, offset: 2 }}>
                            <NavLink className="text-decoration-none" to="/issue">
                                <Button variant="outline-dark" size="lg" block>
                                    Issue PolkaBTC
                                </Button>
                            </NavLink>
                        </Col>
                        <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                            <NavLink className="text-decoration-none" to="/redeem">
                                <Button variant="outline-primary" size="lg" block>
                                    Redeem PolkaBTC
                                </Button>
                            </NavLink>
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}
