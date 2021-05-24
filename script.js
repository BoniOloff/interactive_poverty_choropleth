let countyJson = 'counties.json'
let poverty_json = 'poverty.json'

let countyData
let povertyData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = povertyData.find((item) => {
                    return item['fips'] === id
                })
                let persons = county['pop_18_in_poverty']
                if (persons < 468){
                    return '#89CFF0'
                } else if(persons < 1247) {
                    return '#6CB4EE'
                } else if(persons < 3025) {
                    return '#318CE7'
                } else if(persons >= 3025) {
                    return '#0039a6'
                } else {
                    return '#03524c'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-poverty', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = povertyData.find((item) => {
                    return item['fips'] === id
                })
                let persons = county['pop_18_in_poverty']
                return persons
            })
            .on('mouseover', (countyDataItem)=> {
                tooltip.transition()
                    .style('visibility', 'visible')

                let id = countyDataItem['id']
                let county = povertyData.find((item) => {
                    return item['fips'] === id
                })

                tooltip.text(county['area_name'] +  ' : ' + county['pop_18_in_poverty'] + ' children.')

                var x = d3.event.pageX;
                var y = d3.event.pageY;
                

                tooltip.attr('data-poverty', county['pop_18_in_poverty'] )
                        .style('left', x + 'px')
                        .style('top', y + 'px')
                        .style('opacity', 1)
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })
}

d3.json(countyJson).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(poverty_json).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        povertyData = data
                        console.log(povertyData)
                        drawMap()
                    }
                }
            )
        }
    }
)