import React, { useEffect, useRef, useState } from "react";
import styles from './Invoicing.module.css';
import axios from 'axios';
import Pagination from "../../Components/Pagination/Pagination";
import { formatNumberDecimals, getImageUrl, handleDates } from "../../utils";
import { getAllInvoices, getFilteredInvoices } from "../../store/invoice.slice";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "chart.js/helpers";
import invoiceService from "../../services/invoiceService";
import { Button, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import CustomDateModal from "../../Components/CustomDateModal";
import e from "cors";


export const Invoicing = () => {

    const [period, setPeriod] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const [InvoiceTypeCodeFilter, setInvoiceTypeCodeFilter] = useState(null);
    const [FromDateFilter, setFromDateFilter] = useState(null);
    const [ToDateFilter, setToDateFilter] = useState(null);
    const [Filter, setFilter] = useState(null);
    const [Sorting, setSorting] = useState('issue_date desc');

    const [currentPage, setCurrentPage] = useState(1);
    const [actionsOpen, setActionsOpen] = useState({});
    const [selected, setSelected] = useState([]);
    const [qrCode, setQRCode] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [changeStat, setChangeStat] = useState(null);
    const { filteredInvoices, loading } = useSelector((state) => state.invoice);

    const {
        isOpen: isOpenInvoice,
        onOpen: onOpenInvoice,
        onClose: onCloseInvoice,
    } = useDisclosure();
    const {
        isOpen: isOpenSuccess,
        onOpen: onOpenSuccess,
        onClose: onCloseSuccess,
    } = useDisclosure();
    const {
        isOpen: isOpenFailure,
        onOpen: onOpenFailure,
        onClose: onCloseFailure,
    } = useDisclosure();
    const {
        isOpen: isOpenLoading,
        onOpen: onOpenLoading,
        onClose: onCloseLoading,
    } = useDisclosure();
    const {
        isOpen: isOpenCustom,
        onOpen: onOpenCustom,
        onClose: onCloseCustom,
    } = useDisclosure();
    const {
        isOpen: isOpenStatus,
        onOpen: onOpenStatus,
        onClose: onCloseStatus,
    } = useDisclosure();

    const actionRef = useRef(null);
    const dispatch = useDispatch();
    const itemsPerPage = 10;


    useEffect(() => {
        dispatch(getFilteredInvoices({
            InvoiceTypeCodeFilter,
            FromDateFilter,
            ToDateFilter,
            Filter,
            Sorting,
            MaxResultCount: itemsPerPage,
            SkipCount: (itemsPerPage * (currentPage - 1))
        }));
    }, [InvoiceTypeCodeFilter, FromDateFilter, ToDateFilter, Filter, Sorting, itemsPerPage, currentPage]);


    const handleQRCode = async (theInvoice) => {
        onOpenLoading();
        try {
            const response = await invoiceService.getQRCode({ irn: theInvoice?.irn });
            if (response?.success) {
                const qrCode = response?.result?.data;
                setQRCode(qrCode);
                setSelected(theInvoice);
                onOpenInvoice();
            }
        } catch (error) { }
        onCloseLoading();
        setActionsOpen({});
    }
    const handleTransmit = async (irn) => {
        onOpenLoading();
        try {
            const response = await invoiceService.transmitInvoice({ irn });
            setIsChange(false);
            if (response?.success) {
                onOpenSuccess();
            } else {
                onOpenFailure();
            }
        } catch (error) { }
        onCloseLoading();
        setActionsOpen({});
    }
    const handlePaymentStatus = (theInvoice) => {
        setSelected(theInvoice);
        setChangeStat(theInvoice?.payment_status?.toLowerCase());
        onOpenStatus();
        setActionsOpen({});
    }
    const runChangeStat = async () => {
        try {
            onCloseStatus();
            onOpenLoading();
            const response = await invoiceService.changeStatus({
                payment_status: changeStat,
                irn: selected?.irn
            });
            setIsChange(true);
            if (response?.success) {
                onOpenSuccess();
            } else {
                onOpenFailure();
            }
        } catch (error) { }
        onCloseLoading();
    }



    const toggleAction = (index) => {
        setActionsOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePeriod = (p) => {
        setPeriod(p);
        if (p === 'custom') {
            onCloseCustom();
            setFromDateFilter(handleDates(from));
            setToDateFilter(handleDates(to));
            return
        }
        if (p === 'daily') {
            setFromDateFilter(handleDates());
            setToDateFilter(handleDates());
            return
        }
        if (p === 'weekly') {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);

            setFromDateFilter(handleDates(oneWeekAgo));
            setToDateFilter(handleDates(today));
            return
        }
        if (p === 'monthly') {
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            setFromDateFilter(handleDates(oneMonthAgo));
            setToDateFilter(handleDates(today));
            return
        }
    }

    const handleClickOutside = (event) => {
        if (actionRef.current && !actionRef.current.contains(event.target)) {
            setActionsOpen({});
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);



    return (
        <div className={styles.whole}>

            <div className={styles.invoiceHeader}>
                <h2>Invoices</h2>
                {/* <button><img src={getImageUrl('generate.png')} />Generate Report</button> */}
            </div>


            <div className={styles.tableDiv}>

                <div className={styles.choices}>
                    <div></div>
                    <div className={styles.periods}>
                        Period:
                        <button onClick={() => handlePeriod('daily')} className={period === 'daily' ? styles.active : ''}>Daily</button>
                        <button onClick={() => handlePeriod('weekly')} className={period === 'weekly' ? styles.active : ''}>Weekly</button>
                        <button onClick={() => handlePeriod('monthly')} className={period === 'monthly' ? styles.active : ''}>Monthly</button>
                        <button onClick={onOpenCustom} className={period === 'custom' ? styles.active : ''}>Custom</button>
                    </div>
                </div>

                <table className={styles.invoiceTable}>
                    <thead>
                        <th>IRN</th>
                        <th>Issue Date and Time</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th></th>
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
                                <td className={styles.actions}>
                                    <button className={styles.button1} onClick={() => toggleAction(index)}>...</button>

                                    {actionsOpen[index] && <div
                                        className={styles.theActions}
                                        ref={actionRef}
                                    >
                                        <button className={styles.button3} onClick={() => toggleAction(index)}>
                                            x
                                        </button>
                                        <button
                                            className={styles.button2}
                                            onClick={() => handleQRCode(inv)}
                                        >
                                            Generate QR Code
                                        </button>
                                        <button
                                            className={styles.button2}
                                            onClick={() => handleTransmit(inv?.irn)}
                                        >
                                            Transmit Invoice
                                        </button>
                                        <button
                                            className={styles.button2}
                                            onClick={() => handlePaymentStatus(inv)}
                                        >
                                            Change Payment Status
                                        </button>
                                    </div>}
                                </td>
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

                <Pagination
                    length={filteredInvoices?.totalCount}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>




            <Modal
                isOpen={isOpenInvoice}
                onClose={onCloseInvoice}
                closeOnOverlayClick
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center'>
                        Invoice
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <div style={{ overflow: "auto", maxHeight: "75vh", textTransform: 'capitalize' }}>
                            <table className={styles.table2}>
                                <tr>
                                    <td>IRN:</td>
                                    <td>{selected?.irn}</td>
                                </tr>
                                <tr>
                                    <td>Issue Date and Time:</td>
                                    <td>{selected?.issue_date} {selected?.issue_time}</td>
                                </tr>
                                <tr>
                                    <td>Invoice Type:</td>
                                    <td>{selected?.invoice_type_code_description}</td>
                                </tr>
                                <tr>
                                    <td>Payment Status:</td>
                                    <td>{selected?.payment_status?.toLowerCase()}</td>
                                </tr>
                                <tr>
                                    <td>Note:</td>
                                    <td>{selected?.note}</td>
                                </tr>
                                <tr>
                                    <td>Accounting Supplier:</td>
                                    <td>
                                        <p><b>Name: </b>{selected?.accounting_supplier_party?.party_name}</p>
                                        <p><b>Email: </b>{selected?.accounting_supplier_party?.email}</p>
                                        <p><b>TIN: </b>{selected?.accounting_supplier_party?.tin}</p>
                                        <p><b>Address: </b>{selected?.accounting_supplier_party?.postal_address?.street_name}
                                            , {selected?.accounting_supplier_party?.postal_address?.city_name}
                                            , {selected?.accounting_supplier_party?.postal_address?.state}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Accounting Customer:</td>
                                    <td>
                                        <p><b>Name: </b>{selected?.accounting_customer_party?.party_name}</p>
                                        <p><b>Email: </b><span>{selected?.accounting_customer_party?.email}</span></p>
                                        <p><b>TIN: </b>{selected?.accounting_customer_party?.tin}</p>
                                        <p><b>Address: </b>{selected?.accounting_customer_party?.postal_address?.street_name}
                                            , {selected?.accounting_customer_party?.postal_address?.city_name}
                                            , {selected?.accounting_customer_party?.postal_address?.state}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tax Amount:</td>
                                    <td>{formatNumberDecimals(selected.length > 0 ? selected?.tax_total[0]?.tax_amount : 0)} {selected?.tax_currency_code}</td>
                                </tr>
                                <tr>
                                    <td>VAT Info:</td>
                                    {/* <td>{selected?.irn}</td> */}
                                </tr>
                            </table>

                            <p style={{ textDecoration: 'underline', marginTop: '16px' }}>Invoice QR Code</p>
                            <img src={`data:image/png;base64, ${qrCode}`} alt="" />
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenSuccess}
                onClose={onCloseSuccess}
                closeOnOverlayClick
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <div style={{ overflow: "auto", maxHeight: "75vh", textTransform: 'capitalize' }}>
                            <Stack
                                textAlign='center'
                                alignItems='center'
                                py='24px'
                            >
                                <Image width='80px' height='80px' src={getImageUrl('success.svg')} alt="" />
                                <Text fontSize='24px' fontWeight={500}>{isChange ? 'Payment Status Chnaged Successfully' : 'Transmission Initiated Successfully'}</Text>
                            </Stack>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenFailure}
                onClose={onCloseFailure}
                closeOnOverlayClick
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <div style={{ overflow: "auto", maxHeight: "75vh", textTransform: 'capitalize' }}>
                            <Stack
                                textAlign='center'
                                alignItems='center'
                                py='24px'
                            >
                                <Image width='80px' height='80px' src={getImageUrl('close.svg')} alt="" />
                                <Text fontSize='24px' fontWeight={500}>{isChange ? 'Payment Status Failed to Change' : 'Invoice Failed to Transmit'}</Text>
                            </Stack>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenLoading}
                onClose={onCloseLoading}
                closeOnOverlayClick
                isCentered
            >
                <ModalOverlay />
                <ModalContent w={'fit-content'}>
                    <ModalBody p={6}>
                        <Spinner />
                    </ModalBody>

                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenStatus}
                onClose={onCloseStatus}
                closeOnOverlayClick
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <div style={{ overflow: "auto", maxHeight: "75vh", textTransform: 'capitalize' }}>
                            <Stack
                                textAlign='center'
                                alignItems='center'
                                py='24px'
                            >
                                <Text fontSize='18px' fontWeight={500} >Set Payment Status for Invoice No: {selected?.irn}</Text>
                                <Select w='75%' value={changeStat} onChange={(e) => setChangeStat(e.target.value)}>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </Select>

                                <Button
                                    mt='12px'
                                    w='100%'
                                    bg='#5F57FF'
                                    color='white'
                                    _hover={{ bg: '#5148f7ff' }}
                                    fontWeight={400}
                                    onClick={runChangeStat}
                                >
                                    Change Payment Status
                                </Button>
                            </Stack>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

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