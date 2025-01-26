import React from "react";
import { Menu, MenuItem, MenuButton, MenuDivider, MenuHeader } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import { MdPendingActions } from "react-icons/md";



export default function FloatingMenu({ items, menuBtn }){
    
    const displayItems = items && items.map((item, i) => {
        const { text, type, handleItemClick, value } = item

        const _handleItemClick = () => {
            if(handleItemClick && value){
                return handleItemClick({ value })
            }

            return;
        }

        if(type == 'divider'){
            return <MenuDivider />
        }

        if(type == 'header'){
            return (
                <MenuHeader
                    key={i}
                    className="font-family-Axiforma txt-000 fw-700 text-upper"
                >
                    { text }
                </MenuHeader>            
            )
        }

        return (
            <MenuItem
                key={i}
                onClick={_handleItemClick}
                className="font-family-Axiforma clickable txt-000 text-capitalize"
            >
                { text }
            </MenuItem>
        )
    })
    
    return(
        <Menu 
            menuButton={
                <button type="submit" className="bg-transparent">
                    { menuBtn() }
                </button>
            } 
            transition
        >
            { displayItems }
        </Menu>
    )
}