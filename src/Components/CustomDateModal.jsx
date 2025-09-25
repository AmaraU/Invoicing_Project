import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const CustomDateModal = ({ isOpen, onClose, to, setTo, from, setFrom, handlePeriod }) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'>CUSTOM PERIOD</ModalHeader>
                <ModalBody>
                    <div style={{ overflow: "auto", maxHeight: "75vh", paddingBottom: '24px' }}>
                        <Stack
                            alignItems='center'
                            direction={{ base: 'column', md: 'row' }}
                        >
                            <Stack w='100%'>
                                <Text>From Date</Text>
                                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                            </Stack>
                            <Stack w='100%'>
                                <Text>To Date</Text>
                                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                            </Stack>
                        </Stack>
                        <Button
                            mt='24px'
                            w='100%'
                            bg='#5F57FF'
                            color='white'
                            _hover={{ bg: '#5148f7ff' }}
                            fontWeight={400}
                            onClick={() => handlePeriod('custom')}
                        >
                            Set Custom Dates
                        </Button>
                    </div>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

export default CustomDateModal