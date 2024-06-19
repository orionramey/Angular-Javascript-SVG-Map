import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent implements OnInit {
  @ViewChild('info') info!: ElementRef<HTMLElement>;
  title: string = "Orion's Map";
  //strings for parsed data on api call to be displayed
  countryName: string = '';
  countryCapital: string = '';
  countryRegion: string = '';
  countryIncome: string = '';
  countryLongitude: string = '';
  countryLatitude: string = '';

  ngOnInit(): void {
    //grab all svg paths
    const paths = document.querySelectorAll('path');
    // fill color effect of svg path hovered
    paths.forEach((path: SVGPathElement) => {
      path.addEventListener('mouseenter', () => {
        path.style.fill = 'tomato';
      });
      // Return SVG path to normal color
      path.addEventListener('mouseleave', () => {
        path.style.fill = 'black';
      });
      // Click -> Return ISO
      path.addEventListener('click', async () => {
        const id = path.getAttribute('id');
        //API call for two letter Iso
        if (id) {
          console.log('Clicked on path with ID:', id);
          try {
            const response = await fetch(
              `http://api.worldbank.org/v2/country/${id}?format=json`
            );
            const data = await response.json();
            const filteredData = data[1][0];

            // Display parsed data in world.component.html w/ #info
            this.info.nativeElement.innerHTML = `
            <p>Country Name: <span style="color: tomato;">${filteredData.name}</span></p>
              <p>Capital: <span style="color: tomato;">${filteredData.capitalCity}</span></p>
              <p>Region: <span style="color: tomato;">${filteredData.region.value}</span</p>
              <p>Income Level: <span style="color: tomato;">${filteredData.incomeLevel.value}</span></p>
              <p>Longitude: <span style="color: tomato;">${filteredData.longitude}</span</p>
              <p>Latitude: <span style="color: tomato;">${filteredData.latitude}</span></p>
            `;
            //Error handling logic
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      });
    });
  }
}
