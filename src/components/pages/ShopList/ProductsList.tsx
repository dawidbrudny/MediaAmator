import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';

import styled from 'styled-components';
import Product, { ProductProps } from './Product';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';

const ProductList = () => {
    const [loadingInfo, setLoadingInfo] = useState<string>('Loading...');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const products = useAppSelector((state) => state.products.products);
    const productsPerPage = 3;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    function renderPagination() {
        const pages: JSX.Element[] = [];

        if (currentPage > 2) {
            pages.push(
                <PageNumber
                    key={1}
                    onClick={() => handlePageChange(1)}
                    active={false}
                >
                    1
                </PageNumber>
            );

            if (currentPage > 3) {
                pages.push(<span key="ellipsis-start">...</span>);
            }
        }

        if (currentPage > 1) {
            pages.push(
                <PageNumber
                    key={currentPage - 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    active={false}
                >
                    {currentPage - 1}
                </PageNumber>
            );
        }

        pages.push(
            <PageNumber
                key={currentPage}
                onClick={() => handlePageChange(currentPage)}
                active={true}
            >
                {currentPage}
            </PageNumber>
        );

        if (currentPage < totalPages) {
            pages.push(
                <PageNumber
                    key={currentPage + 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    active={false}
                >
                    {currentPage + 1}
                </PageNumber>
            );

            if (currentPage < totalPages - 1) {
                pages.push(<span key="ellipsis-end">...</span>);
                pages.push(
                    <PageNumber
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        active={false}
                    >
                        {totalPages}
                    </PageNumber>
                );
            }
        }

        return pages;
    }

    useEffect(() => {
            setTimeout(() => {
                if (products.length === 0) setLoadingInfo('Brak produktów')
            }, 5000);
    }, [products]);

    return (
        <>
            <ShopList>
                <Header as={ChooseHeader} level={2}>{products.length > 0 ? 'Lista produktów' : loadingInfo}</Header>
                
                {currentProducts.map((product: object) => {
                    const obj = product as ProductProps;

                    return (
                        <Container
                        as={Product}
                        key={obj.name}
                        image={obj.image}
                        name={obj.name}
                        price={obj.price}
                        />
                    )
                })}
            </ShopList>

            {totalPages > 1 && (
                <Pagination>
                    <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        {'<<'}
                    </PageButton>
                        {renderPagination()}
                    <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        {'>>'}
                    </PageButton>
                </Pagination>
            )}
        </>
    );
};

//  --- Styling ---
const ShopList = styled.section`
    flex-basis: 100%;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
`;

const Header = styled(Container)``;

const Pagination = styled.span`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    user-select: none;
`;

const PageNumber = styled.span<{ active: boolean }>`
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;
    background-color: ${({ active }) => (active ? 'black' : 'lightgray')};
    color: ${({ active }) => (active ? 'white' : 'black')};
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
    border: 1.5px solid black;
`;

const PageButton = styled.button<{ disabled: boolean }>`
    margin: 0 5px;
    padding: 5px 10px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: lightgray;
    color: black;
    font-weight: bold;
    border: 1.5px solid black;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export default ProductList;
