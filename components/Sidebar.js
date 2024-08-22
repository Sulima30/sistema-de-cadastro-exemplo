import { useState } from 'react';
import styles from '../app/sidebar.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${styles.sidebar} ${isOpen ? styles.open : 'closed'}`}>
      <div>
        <div className={styles.toggleBtn} onClick={toggleSidebar}>
          {isOpen ? (
            <Image src={'/icons/x-square-fill.svg'} width={30} height={30} style={{ margin: "0 10px" }} alt='Ícone de Fechar' />
          ) : (
            <Image src={'/icons/list.svg'} width={30} height={30} style={{ margin: "0 10px" }} alt='Ícone de Abrir' />
          )}
        </div>
        <ul className="list-unstyled">
          {menuItems.map((menuItem) => (
            <li key={menuItem.id} className="sidebar-list-item">
              {menuItem.subMenu ? (
                <div>
                  <Link className="sidebar-link text-muted" href="#" data-bs-target={`#${menuItem.id}`} role="button" aria-expanded="false" data-bs-toggle="collapse">
                    <Image src={menuItem.Image} width={25} height={25} style={{ margin: "0px" }} alt='Ícone do Menu' className="icon-style" />
                    <span className={`text-sl ${styles.sidebarLinkTitle} ${isOpen ? styles.show : styles.hide}`}>
                      {menuItem.title}
                    </span>
                  </Link>
                  <ul className="sidebar-menu list-unstyled collapse" id={menuItem.id}>
                    {menuItem.subMenu.map((subMenuItem, index) => (
                      <li key={subMenuItem.href} className="sidebar-list-item">
                        {index > 0 && <div className="folder-line-y"></div>}
                        <Link href={`${subMenuItem.href}`} style={{ textDecoration: "none" }}>
                          <span className="sidebar-link text-muted">
                            {subMenuItem.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link href={`${menuItem.href}`} style={{ textDecoration: "none" }} className="sidebar-link text-muted">
                  <Image src={menuItem.Image} width={25} height={25} style={{ margin: "0px" }} alt="Ícone de Menu" className="icon-style" />
                  <span className="sidebar-link-title text-sl">
                    <span className={`${styles.sidebarLinkTitle} ${isOpen ? styles.show : styles.hide}`}>
                      {menuItem.title}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
