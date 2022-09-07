import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ficha from './ficha.json';

let Y_CURRENT = 15;
const SPACE_BETWEEN_TITLES = 7.5;

const doc = new jsPDF('l')
doc.setFontSize(12);

for (let head of ficha.data) {
    doc.text(`${head.heading} -- Máximo puntaje: ${head.max_score} -- Puntaje alcanzado: ${head.score}`, 10, Y_CURRENT);
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

                    // @ts-ignore
                    columns_names.map(column_name => {
                        // @ts-ignore
                        newRow.push( el.description[column_name]);
                    });
                    newRow.push(el.score);
                    return newRow;
                })

                if(values.length === 0){
                    let empty_row_for_values: string[] = [];
                    columns_names.map(column_name => {
                        empty_row_for_values.push( "Sin datos" );
                    });
                    empty_row_for_values.push("Sin puntaje")

                    values = [ empty_row_for_values ]
                }

                autoTable(doc, {
                    startY: Y_CURRENT,
                    head: [columns_titles],
                    body: values,
                    pageBreak: 'auto'
                })

                Y_CURRENT = (doc as any).lastAutoTable.finalY + 10;
            }

        }
    }

    Y_CURRENT =  (doc as any).lastAutoTable.finalY + 10;
}

console.log(doc.output('arraybuffer'))

doc.save()
