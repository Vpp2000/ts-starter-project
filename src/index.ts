import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ficha from './ficha.json';

let Y_CURRENT = 15;
const SPACE_BETWEEN_TITLES = 7.5;

const doc = new jsPDF('l')
doc.setFontSize(12);
// doc.text("Tabla de Prestamo", 10, Y_CURRENT, );
// doc.text("Tabla de Prestamo", 10, Y_CURRENT + SPACE_BETWEEN_TITLES, );

for (let head of ficha.data) {
    doc.text(`${head.heading} Máximo puntaje: ${head.max_score}`, 10, Y_CURRENT);
    Y_CURRENT += SPACE_BETWEEN_TITLES;
    doc.text(`Puntaje alcanzado: ${head.score}`, 10, Y_CURRENT );
    Y_CURRENT += SPACE_BETWEEN_TITLES;

    for (let subHead of head.subheads) {
        doc.text(`${subHead.subhead}`, 10, Y_CURRENT );
        Y_CURRENT += SPACE_BETWEEN_TITLES;

        for (let headItem of subHead.headItems) {
            for (let documentItem of headItem.documentItems) {
                doc.text(`${documentItem.title_item}`, 10, Y_CURRENT );
                Y_CURRENT += SPACE_BETWEEN_TITLES;

                let columns_names = Object.keys(documentItem.columns)
                let columns_titles = Object.values(documentItem.columns).map(el => el.title);
                columns_titles.push('score')

                let values = documentItem.values.map(el => {
                    let newRow = [];

                    console.log(`el : \n ${JSON.stringify(el, null, 4)}`);

                    // @ts-ignore
                    columns_names.map(column_name => {
                        console.log(`column name: ${column_name}`);
                        // @ts-ignore
                        newRow.push( el.description[column_name]);
                    });
                    newRow.push(el.score);
                    console.log(`newRow : \n ${JSON.stringify(newRow, null, 4)}`);
                    return newRow;
                })

                console.log(columns_titles);
                values.map(e => console.log(e))

                autoTable(doc, {
                    startY: Y_CURRENT,
                    head: [columns_titles],
                    body: values,    // split overflowing columns into pages
                    // repeat this column in split pages
                    pageBreak: 'auto'
                })

                //Y_CURRENT += (doc as any).lastAutoTable.finalY;
                Y_CURRENT = (doc as any).lastAutoTable.finalY + 10;
            }

        }
    }

    Y_CURRENT =  (doc as any).lastAutoTable.finalY + 10;
}


doc.save()
