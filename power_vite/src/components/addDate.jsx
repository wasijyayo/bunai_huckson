import useFirebase from "../hooks/useFirebase";

import { Box, Button, Card, CardBody, Flex, Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
const AddDate = () => {
    const { learnings, calculateTotalTime,email } = useFirebase();

    return (
        <Flex alignItems='center' justify='center' p={5}>
            <Card size={{ base: 'sm', md: 'lg' }}>
                <Box textAlign='center' mb={2} mt={10}>
                    情報記入ページ
                </Box>
                <Heading size='md' textAlign='center'>Learning Records</Heading>
                <CardBody>
                    <Box textAlign='center'>
                        <TableContainer>
                            <Table variant='simple' size={{ base: 'sm', md: 'lg' }}>
                                <Thead>
                                    <Tr>
                                        <Th>運動内容</Th>
                                        <Th>時間(分)</Th>
                                        <Th></Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {learnings.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.title}</Td>
                                            <Td>{item.date}</Td>
                                            <Td>
                                                <Button variant='ghost'><FiEdit color='black' /></Button>
                                            </Td>
                                            <Td>
                                                <Button variant='ghost'><MdDelete color='black' /></Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box p={5}>
                    </Box>

                    {/* Add your additional components or logic here */}
                </CardBody>
            </Card>
        </Flex>
    );
}
export default AddDate;