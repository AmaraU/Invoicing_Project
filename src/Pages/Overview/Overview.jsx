import React, { useEffect, useRef, useState } from "react";
import styles from './Overview.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { getFilteredInvoices, getStatisticsByCurrency, getStatisticsByDate, getStatisticsByDateByCurrency } from "../../store/invoice.slice";
import { HStack, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import CustomDateModal from "../../Components/CustomDateModal";
import { formatNumber, formatNumber2Dec, formatNumberDecimals, handleDates } from "../../utils";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,

} from "recharts";



export const Overview = () => {

    const [period, setPeriod] = useState('');
    const [title1, setTitle1] = useState('TOTAL TRANSACTIONS');
    const [title2, setTitle2] = useState('TOTAL TAX AMOUNT');
    const [isLineChart, setIsLineChart] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [FromDateFilter, setFromDateFilter] = useState(null);
    const [ToDateFilter, setToDateFilter] = useState(null);

    const [_data, setData] = useState([]);
    const { statisticsByDate, statisticsByCurrency, statisticsByDC, filteredInvoices, loading } = useSelector((state) => state.invoice);

    const {
        isOpen: isOpenCustom,
        onOpen: onOpenCustom,
        onClose: onCloseCustom,
    } = useDisclosure();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getStatisticsByDate({
            FromDateFilter,
            ToDateFilter
        }));
        dispatch(getStatisticsByCurrency({
            FromDateFilter,
            ToDateFilter
        }));
        dispatch(getStatisticsByDateByCurrency({
            FromDateFilter,
            ToDateFilter
        }));
        dispatch(getFilteredInvoices({
            FromDateFilter,
            ToDateFilter,
            Sorting: 'issue_date desc',
            MaxResultCount: 5,
        }));
    }, [FromDateFilter, ToDateFilter]);

    console.log(filteredInvoices);
    // console.log(statisticsByDate);
    // console.log(statisticsByCurrency);
    // console.log(statisticsByDC);



    const handlePeriod = (p) => {
        setPeriod(p);
        if (p === 'custom') {
            onCloseCustom();
            setFromDateFilter(handleDates(from));
            setToDateFilter(handleDates(to));
            setTitle1("TOTAL TRANSACTIONS");
            setTitle2("TOTAL TAX AMOUNT");
            return
        }
        if (p === 'daily') {
            setFromDateFilter(handleDates());
            setToDateFilter(handleDates());
            setTitle1("TODAY'S TRANSACTIONS");
            setTitle2("TODAY'S TAX AMOUNT");
            return
        }
        if (p === 'weekly') {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);

            setFromDateFilter(handleDates(oneWeekAgo));
            setToDateFilter(handleDates(today));
            setTitle1("THIS WEEK'S TRANSACTIONS");
            setTitle2("THIS WEEK'S TAX AMOUNT");
            return
        }
        if (p === 'monthly') {
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            setFromDateFilter(handleDates(oneMonthAgo));
            setToDateFilter(handleDates(today));
            setTitle1("THIS MONTH'S TRANSACTIONS");
            setTitle2("THIS MONTH'S TAX AMOUNT");
            return
        }
    }


    const allCurrencies = Array.from(
        new Set(statisticsByDC?.flatMap((entry) => entry.value.map((v) => v.key)))
    );
    const lineData = statisticsByDC?.map((entry) => {
        const row = { date: entry.key.split("T")[0] };

        // initialize every currency to 0
        allCurrencies.forEach((c) => {
            row[c] = 0;
        });

        // overwrite with actual values
        entry.value.forEach((currency) => {
            row[currency.key] = currency.value;
        });

        return row;
    });
    const barData = statisticsByDate?.map((entry) => ({
        date: entry.key.split("T")[0],
        value: entry.value,
    }));
    const COLORS = ["#5F57FF", "#ef4444", "#3b82f6", , "#f59e0b", "#8b5cf6"];


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setUpdateIndex((prevIndex) => (prevIndex + 1) % updates.length);
    //     }, 10000);
    //     return () => clearInterval(interval);
    // }, [updates.length]);


    return (
        <div className={styles.whole}>

            <div className={styles.overviewHeader}>
                <h2>Overview</h2>

                {/* <div className={styles.updates}>
                    <div className={styles.slider}>{updates[updateIndex]}</div>
                </div> */}

                <div className={styles.periods}>
                    Period:
                    <button onClick={() => handlePeriod('daily')} className={period === 'daily' ? styles.active : ''}>Daily</button>
                    <button onClick={() => handlePeriod('weekly')} className={period === 'weekly' ? styles.active : ''}>Weekly</button>
                    <button onClick={() => handlePeriod('monthly')} className={period === 'monthly' ? styles.active : ''}>Monthly</button>
                    <button onClick={onOpenCustom} className={period === 'custom' ? styles.active : ''}>Custom</button>
                </div>
            </div>


            <div className={styles.threeRow}>
                <div className={styles.infoDiv} >
                    <h5>
                        {title1}
                    </h5>
                    <h1>
                        {loading.statByDate ? <Spinner /> : statisticsByDate.reduce((sum, stat) => sum + stat.value, 0)}
                    </h1>
                </div>
                <div className={styles.infoDiv} >
                    <h5>{title2}</h5>

                    {loading.statByCurren ? <Spinner /> :
                        statisticsByCurrency?.slice(0, 3)?.length > 0 ?
                            <Stack direction={{ base: 'column', md: 'row' }} justifyContent='space-between'>
                                {statisticsByCurrency?.slice(0, 3)?.map((curren, i) => (
                                    <div key={i}>
                                        <h6>{curren?.keyDescription ? curren?.keyDescription : ''}</h6>
                                        <p>{formatNumberDecimals(curren?.value ? curren?.value : 0)}</p>
                                    </div>
                                ))}
                            </Stack>
                            :
                            <div>
                                <h6>No Currencies Found</h6>
                                <p>{formatNumber(0)}</p>
                            </div>}
                </div>
            </div>


            <div className={styles.lineDiv}>

                <HStack justifyContent='space-between'>
                    <h5>{isLineChart ? 'LINE GRAPH' : 'BAR CHART'}</h5>

                    <HStack w='fit-content' bg='#F5F5F5' borderRadius='50px' padding={1} alignItems='center'>
                        <button
                            onClick={() => setIsLineChart(false)}
                            className={!isLineChart
                                ? styles.isLine
                                : styles.isnLine
                            }
                        >
                            Transactions
                        </button>

                        <button
                            onClick={() => setIsLineChart(true)}
                            className={isLineChart
                                ? styles.isLine
                                : styles.isnLine
                            }
                        >
                            Currencies
                        </button>
                    </HStack>
                </HStack>

                {isLineChart ?
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => {
                                    const symbols = { NGN: "₦", USD: "$", EUR: "€" };
                                    return [`${symbols[name] || ""}${value.toLocaleString()}`, name];
                                }}
                            />
                            <Legend />

                            {allCurrencies.map((currency, index) => (
                                <Line
                                    key={currency}
                                    type="monotone"
                                    dataKey={currency}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                    :
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="url(#colorGradient)"
                                radius={[8, 8, 0, 0]} // rounded top corners
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5F57FF" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#9591dcff" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                }


            </div>


            <div className={styles.infoDiv}>
                <h2>INVOICES</h2>
                <table className={styles.invoiceTable}>
                    <thead>
                        <th>IRN</th>
                        <th>Issue Date and Time</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Note</th>
                    </thead>

                    <tbody>
                        {filteredInvoices?.items?.map((inv, index) => (
                            <tr key={index} style={{ textTransform: 'capitalize' }}>
                                <td>{inv?.irn}</td>
                                <td>{inv?.issue_date} {inv?.issue_time}</td>
                                <td>{inv?.invoice_type_code_description}</td>
                                <td>{formatNumberDecimals(inv?.tax_total[0]?.tax_amount)} {inv?.tax_currency_code}</td>
                                <td>{inv?.payment_status.toLowerCase()}</td>
                                <td>{inv?.note}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {filteredInvoices && loading.filteredInvoices ? <Text className={styles.loading}>Loading...</Text>

                    : !filteredInvoices || !filteredInvoices?.items || filteredInvoices?.items?.length === 0 ?
                        <Stack w='100%'>
                            <Text className={styles.loading}>No Invoices Found</Text>
                        </Stack>
                        : <></>
                }

            </div>

            <CustomDateModal
                isOpen={isOpenCustom}
                onClose={onCloseCustom}
                handlePeriod={handlePeriod}
                to={to}
                from={from}
                setTo={setTo}
                setFrom={setFrom}
            />

        </div>
    )
}